import 'reflect-metadata';
import { SNS } from 'aws-sdk';
import { SQSEvent, SQSHandler } from 'aws-lambda';
import { getSecretKey } from 'libs/utils/secrets';
import { IAttributeValue } from 'libs/interfaces/batch.interfaces';
import { BatchTagWorker } from 'libs/utils/batchworker/batchworker';
import { IBatchMsg, IBatchPayload, PubSubUtil } from '@bravecredit/brave-sdk';

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
    console.log('marketing error ==> ', error);
  }
};
