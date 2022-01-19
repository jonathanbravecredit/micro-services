import { GSIPartitionKey, GSISortKey, Model, PartitionKey, SortKey } from '@shiftcoders/dynamo-easy';

export const CAMPAIGNSTATUS_INDEX = 'campaignStatus-index';

@Model({ tableName: 'Campaigns' })
export class Campaign {
  @PartitionKey()
  pKey!: number;
  @SortKey()
  version!: number;
  currentVersion: number = 0;
  campaign: string = 'NO_CAMPAIGN';
  denomination: number = 0;
  bonusThreshold: number = 9999;
  bonusAmount: number = 0;
  addOnFlagOne: string = '';
  addOnFlagTwo: string = '';
  addOnFlagThree: string = '';
  startDate: string = '';
  endDate: string = '';
  createdOn: string | undefined;
  modifiedOn: string | undefined;
}

export class CampaignMaker implements Campaign {
  pKey = 1;
  version!: number;
  currentVersion: number = 0;
  campaign: string = 'NO_CAMPAIGN';
  denomination: number = 0;
  bonusThreshold: number = 9999;
  bonusAmount: number = 0;
  addOnFlagOne: string = '';
  addOnFlagTwo: string = '';
  addOnFlagThree: string = '';
  startDate: string = '';
  endDate: string = '';
  createdOn: string | undefined;
  modifiedOn: string | undefined;

  constructor(
    version: number,
    campaign: string,
    denomination: number,
    bonusThreshold: number,
    addOnFlagOne: string,
    addOnFlagTwo: string,
    addOnFlagThree: string,
    startDate: string,
    endDate: string,
  ) {
    this.version = version;
    this.campaign = campaign;
    this.denomination = denomination;
    this.bonusThreshold = bonusThreshold;
    this.addOnFlagOne = addOnFlagOne;
    this.addOnFlagTwo = addOnFlagTwo;
    this.addOnFlagThree = addOnFlagThree;
    this.startDate = startDate;
    this.endDate = endDate;
    this.createdOn = new Date().toISOString();
    this.modifiedOn = new Date().toISOString();
  }
}
