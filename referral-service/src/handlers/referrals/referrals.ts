import 'reflect-metadata';
import { DynamoDBStreamEvent, DynamoDBStreamHandler } from 'aws-lambda';
import { ReferralMonitor } from 'libs/utils/monitors/referralMonitor';

export const main: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent): Promise<void> => {
  const records = event.Records;
  try {
    const monitor = new ReferralMonitor(records);
    await monitor.monitor();
  } catch (err) {
    console.error(err);
  }
};
