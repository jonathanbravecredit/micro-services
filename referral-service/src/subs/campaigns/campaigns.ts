import 'reflect-metadata';
import { DynamoDBStreamEvent, DynamoDBStreamHandler } from 'aws-lambda';
import { CampaignMonitor } from 'libs/utils/monitors/campaignMonitor';

export const main: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent): Promise<void> => {
  const records = event.Records;
  try {
    const monitor = new CampaignMonitor(records);
    await monitor.monitor();
  } catch (err) {
    console.error(err);
  }
};
