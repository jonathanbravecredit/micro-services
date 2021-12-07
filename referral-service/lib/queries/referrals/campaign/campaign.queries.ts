import { DynamoStore } from '@shiftcoders/dynamo-easy';
import { Referral } from 'lib/models/referral.model';

const store = new DynamoStore(Referral);

export const getAllReferralsByCampaign = (referredByCode: string, campaign: string): Promise<Referral[]> => {
  return store
    .scan()
    .whereAttribute('referredByCode')
    .eq(referredByCode)
    .whereAttribute('campaign')
    .eq(campaign)
    .execFetchAll()
    .then((res) => res)
    .catch((err) => err);
};

export const getAllEnrolledReferralsByCampaign = (referredByCode: string, campaign: string): Promise<Referral[]> => {
  return store
    .scan()
    .whereAttribute('referredByCode')
    .eq(referredByCode)
    .whereAttribute('campaign')
    .eq(campaign)
    .whereAttribute('enrollmentStatus')
    .eq('enrolled')
    .execFetchAll()
    .then((res) => res)
    .catch((err) => err);
};

export const getAllEnrolledReferralsByMonth = (
  referredByCode: string,
  campaign: string,
  targetMonth?: string,
  targetYear?: string,
): Promise<Referral[]> => {
  if (targetMonth && targetYear) {
    return store
      .scan()
      .whereAttribute('referredByCode')
      .eq(referredByCode)
      .whereAttribute('enrollmentStatus')
      .eq('enrolled')
      .whereAttribute('campaign')
      .eq(campaign)
      .whereAttribute('createdOn')
      .beginsWith(`${targetYear}-${targetMonth}`)
      .execFetchAll()
      .then((res) => res)
      .catch((err) => err);
  }

  return store
    .scan()
    .whereAttribute('referredByCode')
    .eq(referredByCode)
    .whereAttribute('enrollmentStatus')
    .eq('enrolled')
    .whereAttribute('campaign')
    .eq(campaign)
    .execFetchAll()
    .then((res) => res)
    .catch((err) => err);
};
