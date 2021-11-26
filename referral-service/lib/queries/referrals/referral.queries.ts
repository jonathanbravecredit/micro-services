import { DynamoStore } from '@shiftcoders/dynamo-easy';
import { Referral } from 'lib/models/referral.model';

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

export const listEligibleReferrals = (): Promise<Referral[]> => {
  return store
    .scan()
    .whereAttribute('enrollmentStatus')
    .eq('enrolled')
    .whereAttribute('processingStatus')
    .eq('pending')
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

export const deleteReferral = (id: string): Promise<void> => {
  return store
    .delete(id)
    .returnValues('ALL_OLD')
    .exec()
    .then((res) => res)
    .catch((err) => err);
};

export const updateReferral = async (referral: Partial<Referral>): Promise<Partial<Referral> | null> => {
  if (!referral.id) return null;
  const old = await getReferral(referral.id);
  const merge = {
    ...old,
    ...referral,
  };
  const modifiedOn = new Date().toISOString();
  return store
    .update(merge.id)
    .updateAttribute('referralCode')
    .set(merge.referralCode)
    .updateAttribute('enrollmentStatus')
    .set(merge.enrollmentStatus || 'pending')
    .updateAttribute('processingStatus')
    .set(merge.processingStatus || 'pending')
    .updateAttribute('modifiedOn')
    .set(modifiedOn)
    .returnValues('UPDATED_NEW')
    .exec()
    .then((res) => res)
    .catch((err) => err);
};
