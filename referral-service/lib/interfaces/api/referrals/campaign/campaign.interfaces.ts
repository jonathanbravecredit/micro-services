export interface IGetReferralByCampaign {
  id: string;
  campaign: string;
}

export interface IGetReferralEarningsByCampaignMonthly extends IGetReferralByCampaign {
  month?: string;
  year?: string;
}
