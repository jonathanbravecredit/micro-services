export interface IGetCampaign {
  pKey: number;
  version: number;
}

export interface IUpdateCampaign {
  campaignId: string;
  status?: 'active' | 'inactive';
  startDate?: string;
  endDate?: string;
}

export interface campaignIdeleteCampaign {
  campaignId: string;
}

export interface ICreateCampaign {
  version: number;
  campaign: string;
  denomination: number;
  bonusThreshold: number;
  addOnFlagOne: string;
  addOnFlagTwo: string;
  addOnFlagThree: string;
  startDate: string;
  endDate: string;
}
