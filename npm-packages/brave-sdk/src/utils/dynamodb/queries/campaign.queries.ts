import 'reflect-metadata';
import { DynamoStore } from '@shiftcoders/dynamo-easy';
import { Campaign } from '../../../models/campaign/campaign';

export class CampaignQueries {
  static store = new DynamoStore(Campaign);
  constructor() {}

  static async getCampaign(pkey: number, skey: number): Promise<Campaign | null> {
    return this.store.get(pkey, skey).exec();
  }

  static async listCampaigns(): Promise<Campaign[]> {
    return this.store.scan().execFetchAll();
  }

  static async createCampaign(campaign: Campaign): Promise<void> {
    return this.store.put(campaign).ifNotExists().exec();
  }

  static async updateCurrentCampaign(campaign: Campaign): Promise<void> {
    const now = new Date().toISOString();
    return this.store
      .update(1, 0)
      .updateAttribute('currentVersion')
      .set(campaign.currentVersion)
      .updateAttribute('campaign')
      .set(campaign.campaign)
      .updateAttribute('denomination')
      .set(campaign.denomination)
      .updateAttribute('bonusThreshold')
      .set(campaign.bonusThreshold)
      .updateAttribute('bonusAmount')
      .set(campaign.bonusAmount)
      .updateAttribute('addOnFlagOne')
      .set(campaign.addOnFlagOne || '')
      .updateAttribute('addOnFlagTwo')
      .set(campaign.addOnFlagTwo || '')
      .updateAttribute('addOnFlagThree')
      .set(campaign.addOnFlagThree || '')
      .updateAttribute('startDate')
      .set(campaign.startDate)
      .updateAttribute('endDate')
      .set(campaign.endDate)
      .updateAttribute('modifiedOn')
      .set(now)
      .exec();
  }

  static async getLatestCampaign(pkey: number): Promise<Campaign[]> {
    return this.store.query().wherePartitionKey(pkey).descending().limit(1).exec();
  }
}
