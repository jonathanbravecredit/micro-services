import { SNS, CognitoIdentityServiceProvider } from 'aws-sdk';
import { DynamoDBStreamHandler, DynamoDBStreamEvent, DynamoDBRecord } from 'aws-lambda';
import { InitiativeProgramTagsRunner } from 'libs/utils/runners/InitiativeProgramTagsRunner';

const sns = new SNS();
const pool = process.env.POOL || '';
const cognito = new CognitoIdentityServiceProvider();

export const main: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent): Promise<void> => {
  const records = event.Records;

  try {
    await Promise.all(
      records.map(async (record: DynamoDBRecord) => {
        const { eventName } = record;
        if (eventName != 'INSERT' && eventName != 'MODIFY') return;
        const runner = new InitiativeProgramTagsRunner(eventName, record, sns, cognito, pool);
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
