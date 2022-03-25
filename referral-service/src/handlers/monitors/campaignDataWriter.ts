import 'reflect-metadata';
import { DynamoDBStreamEvent, DynamoDBStreamHandler } from 'aws-lambda';
import { getCampaign } from 'libs/queries/campaigns/campaigns.queries';
import { CampaignManager } from 'libs/utils/managers/campaignManager';

export const main: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent): Promise<void> => {
  const records = event.Records;
  // // Only runs once. when a new campaign is activated.
  const noCampaign = await getCampaign(1, 1);
  if (!noCampaign) {
    console.error('no NO_CAMPAIGN found');
    return;
  }
  if (!records || !records.length) return;

  try {
    await Promise.all(
      records.map(async (record) => {
        const manager = new CampaignManager(record, noCampaign);
        try {
          await manager.process();
        } catch (err) {
          console.error(err);
        }
      }),
    );
  } catch (err) {
    console.error(err);
  }
};
