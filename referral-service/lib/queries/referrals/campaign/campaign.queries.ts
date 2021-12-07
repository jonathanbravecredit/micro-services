import { DynamoStore } from '@shiftcoders/dynamo-easy';
import { Referral } from 'lib/models/referral.model';

const store = new DynamoStore(Referral);

export const getAllReferralsByCampaign = (referredByCode: string, campaign: string): Promise<Referral | null> => {
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
