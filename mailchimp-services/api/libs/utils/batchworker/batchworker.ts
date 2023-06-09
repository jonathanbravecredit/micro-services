import * as _ from "lodash";
import { SNS } from "aws-sdk";
import { IAttributeValue } from "libs/interfaces/batch.interfaces";
import { parallelScanAppData } from "libs/queries/appdata.queries";
import { Mailchimp } from "libs/utils/mailchimp/mailchimp";
import { Dispute } from "libs/models/dispute.model";
import { IMailchimpPacket, IMarketingData, MailMessage } from "libs/utils/mailchimp/interfaces";
import { flattenUser, getUsersBySub } from "libs/queries/cognito.queries";
import { getRandomDisputesById } from "libs/queries/disputes.queries";
import {
  CreditReport,
  CreditReportQueries,
  IBatchMsg,
  IBatchPayload,
  UpdateAppDataInput,
  PubSubUtil,
} from "@bravecredit/brave-sdk";

export class BatchTagWorker {
  lookup: Map<string, string> = new Map();
  constructor(
    protected pool: string,
    protected sns: SNS,
    protected pubsub: PubSubUtil,
    protected config: MailchimpConfig
  ) {}

  /**
   * Helper function to map the record
   * @param rec
   * @param lookup
   * @param config
   * @returns
   */
  async recordMap(rec: IBatchPayload<IBatchMsg<IAttributeValue>>): Promise<void> {
    const message = rec.message;
    const { lookup, pool, config } = this;
    console.log("lookup: ", lookup);
    console.log("pool: ", pool);
    console.log("config: ", config);
    const { exclusiveStartKey: esk, segment, totalSegments } = message;
    console.log("message ==> ", message);
    try {
      const scan = await parallelScanAppData(esk, segment, totalSegments);
      const data = (await Promise.all(
        scan?.items.map(async (i: UpdateAppDataInput) => this.scanMap(i))
      )) as (Data | null)[];
      const inserts = data.map(this.mapInserts).filter(Boolean) as Inserts[];
      const modifies = data.map(this.mapModifies).filter(Boolean) as Modifies[];
      const insertPayloads = this.createInsertPayloads(inserts);
      const modifyPayloads = this.createModifyPayloads(modifies);
      const payloads: MailMessage[] = [...insertPayloads, ...modifyPayloads];
      if (payloads.length) {
        for (let i = 0; i < 2; i++) console.log("payload samples: ", JSON.stringify(payloads[i]));
        const batch = Mailchimp.createBatchPayload(payloads);
        const resp = await Mailchimp.processBatchPayload(batch, config);
        console.log("mailchimp resp: ", resp);
      }
      await this.processNext(scan);
      return;
    } catch (err) {
      console.error(`uncaught exception in recordMap: ${err}`);
      return;
    }
  }

  /**
   * Helper function to map the scan result
   * @param appData
   * @param lookup
   * @returns
   */
  async scanMap(appData: UpdateAppDataInput): Promise<Data | null> {
    const { id: sub, status } = appData;
    const { lookup, pool } = this as unknown as Props;
    console.log("status", status);
    if (!status || status !== "active") return null;
    try {
      const { UserAttributes: attrs } = await getUsersBySub(pool, sub);
      const email = flattenUser(attrs || [], "email");
      if (!email) return null;
      lookup.set(sub, email);
      const disputesArr = await getRandomDisputesById(sub);
      const dispute = disputesArr.pop() || null;
      const [currReport, priorReport] = await CreditReportQueries.listLastTwoReports(sub);
      return {
        appData,
        dispute,
        currReport,
        priorReport,
      };
    } catch (err) {
      console.error(`uncaught exception in scanMap: ${err}`);
      return null;
    }
  }

  /**
   * Helper function to map the insert records
   * @param data
   * @returns
   */
  mapInserts(data: Data | null) {
    if (!data) return null;
    const disputeTriggers = data.dispute ? Mailchimp.marketing.dispute.resolver(null, data.dispute, "INSERT") : [];
    const reportTriggers = data.currReport
      ? Mailchimp.marketing.creditReport.resolver(null, data.currReport, "INSERT")
      : [];
    return {
      sub: data.appData.id,
      disputeTriggers,
      reportTriggers,
    };
  }

  /**
   * Helper function to map the modify records
   * @param data
   * @returns
   */
  mapModifies(data: Data | null) {
    if (!data) return null;
    const appDataTriggers = data.appData ? Mailchimp.marketing.app.resolver(null, data.appData, "MODIFY") : [];
    const { currReport, priorReport } = data;
    const reportTriggers =
      currReport && priorReport ? Mailchimp.marketing.creditReport.resolver(priorReport, currReport, "MODIFY") : [];

    return {
      sub: data.appData.id,
      appDataTriggers,
      reportTriggers,
    };
  }

  /**
   * Helper function to flatten the nested arrays and create insert payloads
   * @param inserts
   * @param lookup
   * @returns
   */
  createInsertPayloads(inserts: Inserts[]): MailMessage[] {
    const { lookup } = this as unknown as Props;
    return _.flattenDeep(
      inserts.map((i) => {
        const email = lookup.get(i.sub);
        return i.disputeTriggers.map((t) => {
          const { data } = t;
          if (data?.api !== "marketing") return;
          return Mailchimp.createMailMessage(email, "tag_user", undefined, data.tag);
        });
      })
    ).filter(Boolean) as MailMessage[];
  }

  /**
   * * Helper function to flatten the nested arrays and create modify payloads
   * @param modifies
   * @param lookup
   * @returns
   */
  createModifyPayloads(modifies: Modifies[]): MailMessage[] {
    const { lookup } = this as unknown as Props;
    return _.flattenDeep(
      modifies.map((m) => {
        const email = lookup.get(m.sub);
        return [...m.appDataTriggers, ...m.reportTriggers].map((t) => {
          const { data } = t;
          if (data?.api !== "marketing") return;
          return Mailchimp.createMailMessage(email, "tag_user", undefined, data.tag);
        });
      })
    ).filter(Boolean) as MailMessage[];
  }

  async processNext(scan: any): Promise<void> {
    if (scan?.lastEvaluatedKey != undefined) {
      const packet: IBatchMsg<IAttributeValue> = {
        exclusiveStartKey: scan.lastEvaluatedKey,
        segment: scan.segment,
        totalSegments: scan.totalSegments,
      };
      const payload = this.pubsub.createSNSPayload<IBatchMsg<IAttributeValue>>(
        "mailchimpbatch",
        packet,
        "mailchimpbatch",
        process.env.MAILCHIMP_SNS_ARN || ""
      );
      try {
        const res = await this.sns.publish(payload).promise();
      } catch (err) {
        console.error(`uncaught exception in processNext: ${err}`);
        return;
      }
    }
  }
}

export interface MailchimpConfig {
  apiKey: string;
  server: string;
}

interface Data {
  appData: UpdateAppDataInput;
  dispute: Dispute | null;
  currReport: CreditReport;
  priorReport: CreditReport;
}

interface Inserts {
  sub: string;
  disputeTriggers: IMailchimpPacket<IMarketingData>[];
  reportTriggers: IMailchimpPacket<IMarketingData>[];
}

interface Modifies {
  sub: string;
  appDataTriggers: IMailchimpPacket<IMarketingData>[];
  reportTriggers: IMailchimpPacket<IMarketingData>[];
}

interface Props {
  lookup: Map<any, any>;
  config: {
    apiKey: string;
    server: string;
  };
  pool: string;
}
