import { DynamoDBRecord } from 'aws-lambda';
import { Campaign } from 'libs/models/campaigns/campaign.model';
import { getCampaign } from 'libs/queries/campaigns/campaigns.queries';
import { ReferralAggregationManager } from 'libs/utils/managers/referralAggregationManager';
import { ReferralSuspensionManager } from 'libs/utils/managers/referralSuspensionManager';

export class ReferralMonitor {
  campaign: Campaign | null = null;
  constructor(public records: DynamoDBRecord[]) {
    this.init();
  }

  async init(): Promise<void> {
    this.campaign = await this.getCampaign();
  }

  async process(): Promise<void> {
    await Promise.all(
      this.records.map(async (rec) => {
        try {
          await this.processSuspensions(rec);
          await this.processAggregations(rec);
        } catch (err) {
          console.error(err);
        }
      }),
    );
  }

  async processSuspensions(rec: DynamoDBRecord): Promise<void> {
    try {
      const manager = new ReferralSuspensionManager(rec);
      await manager.handleSuspensions();
    } catch (err) {
      console.error(err);
    }
  }
  async processAggregations(rec: DynamoDBRecord): Promise<void> {
    if (!this.campaign) return;
    try {
      const aggregator = new ReferralAggregationManager(this.campaign, rec);
      await aggregator.quantifyReferral();
    } catch (err) {
      console.error(err);
    }
  }

  async getCampaign(): Promise<Campaign | null> {
    return await getCampaign(1, 0);
  }
}
