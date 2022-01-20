import { DynamoDBStreamEvent, DynamoDBStreamHandler } from 'aws-lambda';
import { SNS } from 'aws-sdk';
import { PubSubUtil } from 'lib/utils/pubsub/pubsub';

const sns = new SNS({ region: 'us-east-2' });
const pubsub = new PubSubUtil();

export const main: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent): Promise<void> => {
  const records = event.Records;
  records.forEach((r) => {
    console.log('session Pub records: ', JSON.stringify(r));
  });
  try {
    await Promise.all(
      records.map(async (r) => {
        const subject = 'sessiondataupdate';
        const service = 'referralservice';
        const message = JSON.stringify(r);
        const payload = pubsub.createSNSPayload<string>(subject, message, service);
        await sns.publish(payload).promise();
      }),
    );
  } catch (err) {
    console.log('error in session pub: ', JSON.stringify(err));
  }
};
