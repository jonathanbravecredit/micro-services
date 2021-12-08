export interface IGetCampaign {
  campaignId: string;
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
  campaignId: string;
  startDate: string;
  endDate: string;
}
