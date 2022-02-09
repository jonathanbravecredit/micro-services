import 'reflect-metadata';
import { DynamoStore } from '@shiftcoders/dynamo-easy';
import { CAMPAIGNACTIVE_GSI, ELIGIBLE_GSI, Referral, REFERRAL_CODE_GSI } from 'lib/models/referral.model';

const store = new DynamoStore(Referral);

export const getReferral = (id: string): Promise<Referral | null> => {
  return store
    .get(id)
    .exec()
    .then((res) => res)
    .catch((err) => err);
};

export const listReferrals = (): Promise<Referral[]> => {
  return store
    .scan()
    .execFetchAll()
    .then((res) => res)
    .catch((err) => err);
};

export const createReferral = (referral: Referral): Promise<void> => {
  return store
    .put(referral)
    .ifNotExists()
    .exec()
    .then((res) => res)
    .catch((err) => err);
};

export const updateReferral = (referral: Referral): Promise<void> => {
  return store
    .put(referral)
    .exec()
    .then((res) => res)
    .catch((err) => err);
};

export const updateEnrollment = (pkey: string): Promise<void> => {
  return store
    .update(pkey)
    .updateAttribute('enrolled')
    .set(true)
    .exec()
    .then((res) => res)
    .catch((err) => err);
};

export const suspendReferral = (id: string): Promise<void> => {
  return store
    .update(id)
    .updateAttribute('suspended')
    .set(true)
    .exec()
    .then((res) => res)
    .catch((err) => err);
};

export const getActiveCampaignReferrals = (campaign: string): Promise<Referral[]> => {
  return store
    .query()
    .index(CAMPAIGNACTIVE_GSI)
    .wherePartitionKey(campaign)
    .execFetchAll()
    .then((res) => res)
    .catch((err) => err);
};

export const getEligibileReferrals = (): Promise<Referral[]> => {
  return store
    .query()
    .index(ELIGIBLE_GSI)
    .wherePartitionKey(1)
    .execFetchAll()
    .then((res) => {
      console.log('eligible referrals: ', JSON.stringify(res));
      return res;
    })
    .catch((err) => {
      console.log('eligible error: ', JSON.stringify(err));
      return err;
    });
};

export const getReferralByCode = (code: string): Promise<Referral | null> => {
  return store
    .query()
    .index(REFERRAL_CODE_GSI)
    .wherePartitionKey(code)
    .execSingle()
    .then((res) => res)
    .catch((err) => err);
};

export const updateReferralEligibility = (id: string, eligibility: 1 | 0): Promise<void> => {
  return store
    .update(id)
    .updateAttribute('eligible')
    .set(eligibility)
    .exec()
    .then((res) => res)
    .catch((err) => err);
};

export const updateReferralCampaign = (id: string, campaign: string): Promise<void> => {
  const now = new Date().toISOString();
  return store
    .update(id)
    .updateAttribute('campaignActive')
    .set(campaign)
    .updateAttribute('modifiedOn')
    .set(now)
    .exec()
    .then((res) => {
      console.log('update campaing: ', JSON.stringify(res));
      return res;
    })
    .catch((err) => {
      console.log('update campaign error: ', JSON.stringify(err));
      return err;
    });
};

export const batchDeleteReferrals = (records: Referral[]): Promise<any> => {
  return store
    .batchWrite()
    .delete(records)
    .exec()
    .then((res) => res)
    .catch((err) => {
      console.log('batch delete error ==> ', err);
      return err;
    });
};
