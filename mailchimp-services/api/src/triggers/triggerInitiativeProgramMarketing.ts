import { SNS } from 'aws-sdk';
import { DynamoDBStreamHandler, DynamoDBStreamEvent, DynamoDBRecord } from 'aws-lambda';
import { InitiativeProgramTagsRunner } from 'libs/utils/runners/InitiativeProgramTagsRunner';

export const main: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent): Promise<void> => {
  const records = event.Records;
  const sns = new SNS();
  const pool = process.env.POOL || '';
  console.log('sns', sns);
  console.log('pool', pool);
  console.log('records', JSON.stringify(records));

  try {
    await Promise.all(
      records.map(async (record: DynamoDBRecord) => {
        const { eventName } = record;
        if (eventName != 'INSERT' && eventName != 'MODIFY') return;
        const runner = new InitiativeProgramTagsRunner(eventName, record, pool);
        await runner.getEmail();
        await runner.getPackets();
        try {
          await runner.publish();
        } catch (err) {
          console.error(err);
        }
      }),
    );
  } catch (err) {
    console.error(err);
  }
};
