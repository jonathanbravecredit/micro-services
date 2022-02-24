import 'reflect-metadata';
import { Handler } from 'aws-lambda';
import { SNS } from 'aws-sdk';
import { PubSubUtil } from 'libs/pubsub/pubsub';
import { IAttributeValue, IBatchMsg } from 'libs/interfaces/batch.interfaces';

// request.debug = true; import * as request from 'request';
const sns = new SNS({ region: 'us-east-2' });
const pubsub = new PubSubUtil();

/**
 * Handler that processes single requests for Transunion services
 * @param service Service invoked via the SNS Proxy 'transunion'
 * @param command REST based command to invoke actions
 * @param message Object containing service specific package for processing
 * @returns Lambda proxy response
 */
export const main: Handler<any, any> = async (event: any): Promise<any> => {
  if (process.env.STAGE == 'dev' && !event.override) return;
  try {
    let counter = 0;
    const segments = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    await Promise.all(
      segments.map(async (s) => {
        const packet: IBatchMsg<IAttributeValue> = {
          exclusiveStartKey: undefined,
          segment: s,
          totalSegments: segments.length,
        };
        const payload = pubsub.createSNSPayload<IBatchMsg<IAttributeValue>>('opsbatch', packet, 'referralsreport');
        await sns.publish(payload).promise();
      }),
    );
    const results = { success: true, error: null, data: `Ops:batch queued ${counter} records.` };
    return JSON.stringify(results);
  } catch (err) {
    console.log('err ===> ', err);
    return JSON.stringify({ success: false, error: { error: `Unknown server error=${err}` } });
  }
};