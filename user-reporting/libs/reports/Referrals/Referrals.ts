import dayjs from "dayjs";
import { ReportBase } from "libs/reports/ReportBase";
import {
  IAttributeValue,
  IBatchMsg,
  IBatchPayload,
} from "libs/interfaces/batch.interfaces";
import { OpsReportMaker } from "libs/models/ops-reports";
import { createOpReport } from "libs/queries/ops-report.queries";
import { ReportNames } from "../../data/reports";
import { Referral } from "../../../../mailchimp-services/libs/models/referral.model";
import { parallelScanReferrals } from '../../db/referrals';

export class Referrals extends ReportBase<
  IBatchMsg<IAttributeValue> | undefined
> {
  constructor(records: IBatchPayload<IBatchMsg<IAttributeValue>>[]) {
    super(records);
  }

  async processQuery(
    esk: IAttributeValue | undefined,
    segment: number,
    totalSegments: number
  ): Promise<IBatchMsg<IAttributeValue> | undefined> {
    return await parallelScanReferrals(esk, segment, totalSegments);
  }

  async processScan(): Promise<void> {
    await Promise.all(
      this.scan?.items.map(async (item: Referral) => {
        const batchId = dayjs(new Date()).add(-5, "hours").format("YYYY-MM-DD");
        const schema = {};
        let record: Referral = item;
        if (!record.enrolled) return;
        const ops = new OpsReportMaker(
          ReportNames.ReferralsAll,
          batchId,
          JSON.stringify(schema),
          JSON.stringify({
            ...record,
            referralEmail: "",
            referredById: record.referredById || "",
            referredByEmail: record.referredByEmail || "",
          })
        );
        await createOpReport(ops);
        this.counter++;
        return true;
      })
    );
  }

  async processNext() {
    const scan = this.scan;
    if (scan?.lastEvaluatedKey != undefined) {
      const packet: IBatchMsg<IAttributeValue> = {
        exclusiveStartKey: scan.lastEvaluatedKey,
        segment: scan.segment,
        totalSegments: scan.totalSegments,
      };
      const payload = this.pubsub.createSNSPayload<IBatchMsg<IAttributeValue>>(
        "opsbatch",
        packet,
        "referralsreport"
      );
      const res = await this.sns.publish(payload).promise();
      console.log("sns resp ==> ", res);
    }
  }
}
