import { DynamoDBRecord } from "aws-lambda";
import { CampaignDataManager } from "libs/utils/managers/campaignDataManager";
import { Campaign, CampaignQueries } from "@bravecredit/brave-sdk";

export class CampaignMonitor {
  campaign: Campaign | null = null;
  constructor(public records: DynamoDBRecord[]) {}

  async init(): Promise<void> {
    this.campaign = await this.getNoCampaign();
    console.log("campaign: ", this.campaign);
  }

  async monitor(): Promise<void> {
    console.log("records: ", this.records);
    await Promise.all(
      this.records.map(async (rec) => {
        try {
          await this.checkCampaignStatus(rec);
        } catch (err) {
          console.error(err);
        }
      })
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

  async getNoCampaign(): Promise<Campaign | null> {
    return await CampaignQueries.getCampaign(1, 1);
  }
}
