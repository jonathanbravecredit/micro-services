import { DynamoDBRecord } from 'aws-lambda';
import { Campaign } from 'libs/models/campaigns/campaign.model';
import { getCampaign } from 'libs/queries/campaigns/campaigns.queries';
import { CampaignDataManager } from 'libs/utils/managers/campaignDataManager';

export class CampaignMonitor {
  campaign: Campaign | null = null;
  constructor(public records: DynamoDBRecord[]) {}

  async init(): Promise<void> {
    this.campaign = await this.getCampaign();
  }

  async monitor(): Promise<void> {
    await Promise.all(
      this.records.map(async (rec) => {
        try {
          await this.checkCampaignStatus(rec);
        } catch (err) {
          console.error(err);
        }
      }),
    );
  }

  async checkCampaignStatus(rec: DynamoDBRecord): Promise<void> {
    if (!this.campaign) return;
    try {
      const manager = new CampaignDataManager(rec, this.campaign);
      await manager.process();
    } catch (err) {
      console.error(err);
    }
  }

  async getCampaign(): Promise<Campaign | null> {
    return await getCampaign(1, 0);
  }
}
