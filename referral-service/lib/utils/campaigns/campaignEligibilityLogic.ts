import { ICreateReferral } from "lib/interfaces";
import * as queries from 'lib/queries';

const checkBasicEligibility = async (payload: ICreateReferral): Promise<boolean> => {
  if (!payload.referredByCode) return false;
  const partentReferral = await queries.getReferralByReferralCode(payload.referredByCode);
  return !!partentReferral?.referralApproved
}

export const campaignEligibilityLogic: {
  [key: string]: (payload: ICreateReferral) => Promise<boolean>;
} = {
  dec2020: async () => { return false },
  jan2022: checkBasicEligibility,
};

export const eligible = (referral: ICreateReferral) => {
  if (!referral.campaign) return false;
  const logic = campaignEligibilityLogic[referral.campaign]
  if (!logic) return false;
  return logic(referral)
}
