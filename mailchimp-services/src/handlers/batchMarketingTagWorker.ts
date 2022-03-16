import 'reflect-metadata';
import * as _ from 'lodash';
import { SNS } from 'aws-sdk';
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
import { PubSubUtil } from 'lib/utils/pubsub/pubsub';
import { BatchTagWorker } from 'lib/utils/batchworker/batchworker';
// import * as NodeMailMessage from 'nodemailer/lib/mailer/mail-message';
const mailchimpMarketingSKLoc = process.env.MAILCHIMP_MRKT_SECRET_LOCATION || '';
const POOL = process.env.POOL || '';
const sns = new SNS({ region: 'us-east-2' });
const pubsub = new PubSubUtil();

export const main: SQSHandler = async (event: SQSEvent): Promise<void> => {
  let config: { apiKey: string; server: string };
  try {
    const secretJSON = await getSecretKey(mailchimpMarketingSKLoc);
    if (!secretJSON) throw `Cannot retrieve marketing secret key`;
    const { mailchimpMrkt: secret } = JSON.parse(secretJSON);
    config = { apiKey: secret, server: 'us18' };
  } catch (err: any) {
    console.log('marketing secrets errors ===> ', err);
    return;
  }

  try {
    const records = event.Records.map((r: any) => {
      return JSON.parse(r.body) as IBatchPayload<IBatchMsg<IAttributeValue>>;
    });
    if (!records.length) throw 'no records';
    const worker = new BatchTagWorker(POOL, sns, pubsub, config);
    await Promise.all(
      records.map(async (rec) => {
        return worker.recordMap(rec);
      }),
    );
  } catch (error) {
    console.log('merketing error ==> ', error);
  }
};
