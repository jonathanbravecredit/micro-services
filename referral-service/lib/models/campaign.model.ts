import { Model, PartitionKey } from '@shiftcoders/dynamo-easy';

@Model({ tableName: 'Campaigns' })
export class Campaign {
  @PartitionKey()
  campaignId!: string;
  status: 'active' | 'inactive' = 'inactive';
  startDate: string | undefined;
  endDate: string | undefined;
  createdOn: string | undefined;
  modifiedOn: string | undefined;
}

export class CampaignMaker implements Campaign {
  campaignId: string;
  status: 'active' | 'inactive';
  startDate: string | undefined;
  endDate: string | undefined;
  createdOn: string | undefined;
  modifiedOn: string | undefined;

  constructor(campaignId: string, startDate: string, endDate: string) {
    this.campaignId = campaignId;
    this.status = 'inactive';
    this.startDate = startDate;
    this.endDate = endDate;
    this.createdOn = new Date().toISOString();
    this.modifiedOn = new Date().toISOString();
  }
}
