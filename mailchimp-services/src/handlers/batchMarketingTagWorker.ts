import 'reflect-metadata';
import * as _ from 'lodash';
import { SQSEvent, SQSHandler } from 'aws-lambda';
import { UpdateAppDataInput } from 'lib/aws/api.service';
import { parallelScanAppData } from 'lib/queries/appdata.queries';
import { getLastTwoReports } from 'lib/queries/CreditReport.queries';
import { getRandomDisputesById } from 'lib/queries/disputes.queries';
import { IMailchimpPacket, IMarketingData, MailMessage } from 'lib/utils/mailchimp/interfaces';
import { Mailchimp } from 'lib/utils/mailchimp/mailchimp';
import { getSecretKey } from 'lib/utils/secrets';
import { IBatchPayload, IBatchMsg, IAttributeValue } from 'lib/interfaces/batch.interfaces';
import { getUsersBySub } from 'lib/queries/cognito.queries';
import { Dispute } from 'lib/models/dispute.model';
import { CreditReport } from 'lib/models/CreditReport.model';
// import * as NodeMailMessage from 'nodemailer/lib/mailer/mail-message';
const mailchimpMarketingSKLoc = process.env.MAILCHIMP_MRKT_SECRET_LOCATION || '';
const POOL = (process.env.POOL = '');

export const main: SQSHandler = async (event: SQSEvent): Promise<void> => {
  const userEmailLookup = new Map();
  let mrktConfig: { apiKey: string; server: string };

  try {
    const secretJSON = await getSecretKey(mailchimpMarketingSKLoc);
    if (!secretJSON) throw `Cannot retrieve marketing secret key`;
    const { mailchimpMrkt: secret } = JSON.parse(secretJSON);
    mrktConfig = { apiKey: secret, server: 'us18' };
  } catch (err: any) {
    console.log('marketing secrets errors ===> ', err);
    return;
  }

  try {
    const records = event.Records.map((r: any) => {
      return JSON.parse(r.body) as IBatchPayload<IBatchMsg<IAttributeValue>>;
    });
    if (!records.length) throw 'no records';
    await Promise.all(
      records.map(async (rec) => {
        return recordMap(rec, userEmailLookup, mrktConfig);
      }),
    );
  } catch (error) {
    console.log('merketing error ==> ', error);
  }
};

/**
 * Helper function to map the record
 * @param rec
 * @param lookup
 * @param config
 * @returns
 */
const recordMap = async (
  rec: IBatchPayload<IBatchMsg<IAttributeValue>>,
  lookup: Map<any, any>,
  config: { apiKey: string; server: string },
): Promise<void> => {
  const message = rec.message;
  const { exclusiveStartKey: esk, segment, totalSegments } = message;
  console.log('message ==> ', message);
  const scan = await parallelScanAppData(esk, segment, totalSegments);
  const data = (await Promise.all(
    scan?.items.map(async (i: UpdateAppDataInput) => scanMap(i, lookup)),
  )) as (Data | null)[];
  const inserts = data.map(mapInserts).filter(Boolean) as Inserts[];
  const modifies = data.map(mapModifies).filter(Boolean) as Modifies[];
  const insertPayloads = createInsertPayloads(inserts, lookup);
  const modifyPayloads = createModifyPayloads(modifies, lookup);
  const payloads: MailMessage[] = [...insertPayloads, ...modifyPayloads];
  if (payloads.length) {
    for (let i = 0; i < 2; i++) console.log('payload samples: ', JSON.stringify(payloads[i]));
    const batch = Mailchimp.createBatchPayload(payloads);
    const resp = await Mailchimp.processBatchPayload(batch, config);
    console.log('mailchimp resp: ', resp);
  }
  return;
};

/**
 * Helper function to map the scan result
 * @param appData
 * @param lookup
 * @returns
 */
const scanMap = async (appData: UpdateAppDataInput, lookup: Map<any, any>): Promise<Data | null> => {
  const { id: sub, status } = appData;
  if (status?.toLowerCase() !== 'active') return null;
  const email = await getUsersBySub(sub, POOL);
  lookup.set(sub, email);
  const disputesArr = await getRandomDisputesById(sub);
  const dispute = disputesArr.pop() || null;
  const [currReport, priorReport] = await getLastTwoReports(sub);
  return {
    appData,
    dispute,
    currReport,
    priorReport,
  };
};

/**
 * Helper function to map the insert records
 * @param data
 * @returns
 */
const mapInserts = (data: Data | null) => {
  if (!data) return null;
  const disputeTriggers = data.dispute ? Mailchimp.marketing.dispute.resolver(null, data.dispute, 'INSERT') : [];
  const reportTriggers = data.currReport
    ? Mailchimp.marketing.creditReport.resolver(null, data.currReport, 'INSERT')
    : [];
  return {
    sub: data.appData.id,
    disputeTriggers,
    reportTriggers,
  };
};

/**
 * Helper function to map the modify records
 * @param data
 * @returns
 */
const mapModifies = (data: Data | null) => {
  if (!data) return null;
  const appDataTriggers = data.appData ? Mailchimp.marketing.app.resolver(null, data.appData, 'MODIFY') : [];
  const { currReport, priorReport } = data;
  const reportTriggers =
    currReport && priorReport ? Mailchimp.marketing.creditReport.resolver(priorReport, currReport, 'MODIFY') : [];

  return {
    sub: data.appData.id,
    appDataTriggers,
    reportTriggers,
  };
};

/**
 * Helper function to flatten the nested arrays and create insert payloads
 * @param inserts
 * @param lookup
 * @returns
 */
const createInsertPayloads = (inserts: Inserts[], lookup: Map<any, any>): MailMessage[] => {
  return _.flattenDeep(
    inserts.map((i) => {
      const email = lookup.get(i.sub);
      return i.disputeTriggers.map((t) => {
        const { data } = t;
        if (data?.api !== 'marketing') return;
        return Mailchimp.createMailMessage(email, 'tag_user', undefined, data.tag);
      });
    }),
  ).filter(Boolean) as MailMessage[];
};

/**
 * * Helper function to flatten the nested arrays and create modify payloads
 * @param modifies
 * @param lookup
 * @returns
 */
const createModifyPayloads = (modifies: Modifies[], lookup: Map<any, any>): MailMessage[] => {
  return _.flattenDeep(
    modifies.map((m) => {
      const email = lookup.get(m.sub);
      return [...m.appDataTriggers, ...m.reportTriggers].map((t) => {
        const { data } = t;
        if (data?.api !== 'marketing') return;
        return Mailchimp.createMailMessage(email, 'tag_user', undefined, data.tag);
      });
    }),
  ).filter(Boolean) as MailMessage[];
};

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
