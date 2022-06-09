import 'reflect-metadata';
import { DynamoStore } from '@shiftcoders/dynamo-easy';
import { CAMPAIGNACTIVE_GSI, ELIGIBLE_GSI, Referral, REFERRAL_CODE_GSI } from 'libs/models/referrals/referral.model';

const store = new DynamoStore(Referral);

export const getReferral = (id: string): Promise<Referral | null> => {
  return store.get(id).exec();
};

export const listReferrals = (): Promise<Referral[]> => {
  return store.scan().execFetchAll();
};

export const createReferral = (referral: Referral): Promise<void> => {
  return store.put(referral).ifNotExists().exec();
};

export const updateReferral = (referral: Referral): Promise<void> => {
  return store.put(referral).exec();
};

export const updateEnrollment = (pkey: string): Promise<Referral> => {
  return store.update(pkey).updateAttribute('enrolled').set(true).returnValues('ALL_NEW').exec();
};

export const updatePaidOut = (pkey: string, paidOut: number): Promise<void> => {
  return store.update(pkey).updateAttribute('campaignActivePaid').set(paidOut).exec();
};

export const updateAddOn = (pkey: string, addOn: number): Promise<void> => {
  return store
    .update(pkey)
    .updateAttribute('campaignActiveAddOn')
    .set(addOn)
    .updateAttribute('totalAddOn')
    .incrementBy(addOn)
    .exec();
};

export const updateNextPaymentDate = (pkey: string, paymentDate: string): Promise<void> => {
  return store.update(pkey).updateAttribute('nextPaymentDate').set(paymentDate).exec();
};

export const suspendReferral = (id: string): Promise<void> => {
  return store.update(id).updateAttribute('suspended').set(true).exec();
};

export const getActiveCampaignReferrals = (campaign: string): Promise<Referral[]> => {
  return store.query().index(CAMPAIGNACTIVE_GSI).wherePartitionKey(campaign).execFetchAll();
};

export const getEligibileReferrals = (): Promise<Referral[]> => {
  return store.query().index(ELIGIBLE_GSI).wherePartitionKey(1).execFetchAll();
};

export const getReferralByCode = (code: string | null): Promise<Referral | null> => {
  if (!code) return Promise.resolve(null);
  return store.query().index(REFERRAL_CODE_GSI).wherePartitionKey(code).execSingle();
};

export const updateReferralEligibility = (id: string, eligibility: 1 | 0): Promise<void> => {
  return store.update(id).updateAttribute('eligible').set(eligibility).exec();
};

export const updateReferralCampaign = (id: string, campaign: string): Promise<void> => {
  const now = new Date().toISOString();
  return store.update(id).updateAttribute('campaignActive').set(campaign).updateAttribute('modifiedOn').set(now).exec();
};

export const batchDeleteReferrals = (records: Referral[]): Promise<any> => {
  return store.batchWrite().delete(records).exec();
};
