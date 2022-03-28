import 'reflect-metadata';
import { DynamoDBStreamEvent, DynamoDBStreamHandler, SNSEvent, SNSHandler } from 'aws-lambda';
import { ReferralMonitor } from 'libs/utils/monitors/referralMonitor';

export const main: DynamoDBStreamHandler | SNSHandler = async (
  event: DynamoDBStreamEvent | SNSEvent,
): Promise<void> => {
  const records = event.Records;
  try {
    const monitor = new ReferralMonitor(records);
    await monitor.init();
    await monitor.monitor();
  } catch (err) {
    console.error(err);
  }
};
