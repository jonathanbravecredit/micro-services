import { ICreateReferral } from 'lib/interfaces';
import { getReferralByReferralCode } from 'lib/queries';

const checkBasicEligibility = async (payload: ICreateReferral): Promise<boolean> => {
  if (!payload.referredByCode) return false;
  try {
    const parentReferral = await getReferralByReferralCode(payload.referredByCode);
    if (!parentReferral) return false;
    if (parentReferral.campaign !== payload.campaign) return false;
    return !!parentReferral.referralApproved;
  } catch (err) {
    console.log('error ===> ', err);
    return false;
  }
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
