import 'reflect-metadata';
import { Handler } from 'aws-lambda';
import { SNS } from 'aws-sdk';
import { PubSubUtil } from 'libs/utils/pubsub/pubsub';
import { IAttributeValue } from 'libs/interfaces/batch.interfaces';
import { IBatchMsg } from '@bravecredit/brave-sdk';
const sns = new SNS({ region: 'us-east-2' });
const pubsub = new PubSubUtil();

export const main: Handler = async (): Promise<any> => {
  try {
    let counter = 0;
    const segments: number[] = [];
    for (let i = 0; i < 10; i++) {
      segments.push(i);
    }
    await Promise.all(
      segments.map(async (s) => {
        const packet: IBatchMsg<IAttributeValue> = {
          exclusiveStartKey: undefined,
          segment: s,
          totalSegments: segments.length,
        };
        const payload = pubsub.createSNSPayload<IBatchMsg<IAttributeValue>>('mailchimpbatch', packet);
        await sns.publish(payload).promise();
      }),
    );
    const results = { success: true, error: null, data: `Mailchimp:batch queued ${counter} records.` };
    return JSON.stringify(results);
  } catch (error) {
    console.log('merketing error ==> ', error);
    return JSON.stringify({ success: false, error: { error: `Unknown server error=${JSON.stringify(error)}` } });
  }
};
