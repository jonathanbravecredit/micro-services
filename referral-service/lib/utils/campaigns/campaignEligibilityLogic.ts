import { ICreateReferral } from 'lib/interfaces';
import { listActiveCampaigns } from 'lib/queries';
import * as moment from 'moment';

const checkBasicEligibility = async (payload: ICreateReferral): Promise<boolean> => {
  return false;
};

export const campaignEligibilityLogic: {
  [key: string]: (payload: ICreateReferral) => Promise<boolean>;
} = {
  NO_CAMPAIGN: async () => {
    return true;
  },
  dec2020: async () => {
    return false;
  },
  jan2022: checkBasicEligibility,
};

export const eligible = (referral: ICreateReferral) => {
  if (!referral.campaign) return false;
  const logic = campaignEligibilityLogic[referral.campaign];
  if (!logic) return false;
  return logic(referral);
};

export const defaultEligibility = async (referral: ICreateReferral): Promise<boolean> => {
  // check if a campaign is active
  const activeCampaigns = await listActiveCampaigns();
  const currentCampaign = activeCampaigns.filter((c) => {
    const now = new Date();
    return moment(now).isBefore(c.endDate);
  })[0];
  return currentCampaign ? true : false;
};
