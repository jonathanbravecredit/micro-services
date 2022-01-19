import { GSIPartitionKey, GSISortKey, Model, PartitionKey } from '@shiftcoders/dynamo-easy';

export const CAMPAIGNSTATUS_INDEX = 'campaignStatus-index';

@Model({ tableName: 'Campaigns' })
export class Campaign {
  @PartitionKey()
  campaignId!: string;
  @GSIPartitionKey(CAMPAIGNSTATUS_INDEX)
  campaginStatus: 'active' | 'inactive' = 'inactive';
  endDate: string | undefined;
  createdOn: string | undefined;
  modifiedOn: string | undefined;
}

export class CampaignMaker implements Campaign {
  campaignId: string;
  campaginStatus: 'active' | 'inactive';
  startDate: string | undefined;
  endDate: string | undefined;
  createdOn: string | undefined;
  modifiedOn: string | undefined;

  constructor(campaignId: string, startDate: string, endDate: string) {
    this.campaignId = campaignId;
    this.campaginStatus = 'inactive';
    this.startDate = startDate;
    this.endDate = endDate;
    this.createdOn = new Date().toISOString();
    this.modifiedOn = new Date().toISOString();
  }
}
