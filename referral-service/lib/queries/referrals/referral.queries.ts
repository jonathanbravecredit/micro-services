import { and, attribute, DynamoStore, not } from '@shiftcoders/dynamo-easy';
import { CURRENT_CAMPAIGN } from 'lib/data/campaign';
import { Referral } from 'lib/models/referral.model';

const store = new DynamoStore(Referral);

export const getReferral = (id: string): Promise<Referral | null> => {
  return store
    .get(id)
    .exec()
    .then((res) => res)
    .catch((err) => err);
};

export const getReferralByReferralCode = (code: string | undefined): Promise<Referral | null> => {
  return store
    .query()
    .index('referralCode-index')
    .wherePartitionKey(code)
    .execSingle()
    .then((res) => res)
    .catch((err) => {
      console.log(err);
      return err;
    });
};

export const listEnrolledReferralsByReferredBy = (referredByCode: string): Promise<Referral[]> => {
  return store
    .scan()
    .whereAttribute('referredByCode')
    .eq(referredByCode)
    .whereAttribute('enrollmentStatus')
    .eq('enrolled')
    .execFetchAll()
    .then((res) => res)
    .catch((err) => err);
};

export const listEnrolledReferralsByReferredByMonthly = (
  referredByCode: string,
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
    .execFetchAll()
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
    .where(
      and(
        attribute('campaign').eq(CURRENT_CAMPAIGN),
        attribute('enrollmentStatus').eq('enrolled'),
        attribute('referralApproved').eq(true),
      ),
    )
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
  const merge: Partial<Referral> = {
    ...old,
    ...referral,
  };
  const modifiedOn = new Date().toISOString();
  return store
    .update(merge.id!)
    .updateAttribute('referralCode')
    .set(merge.referralCode!)
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

export const updateDeleteReferral = async (id: string) => {
  return store
    .update(id)
    .updateAttribute('campaign')
    .set('DELETE')
    .updateAttribute('referralApproved')
    .set(false)
    .updateAttribute('referralStatus')
    .set('suspended')
    .exec()
    .then((res) => res)
    .catch((err) => err);
};

export const enrollReferral = async (id: string): Promise<Partial<Referral> | null> => {
  const modifiedOn = new Date().toISOString();
  return store
    .update(id)
    .updateAttribute('enrollmentStatus')
    .set('enrolled')
    .updateAttribute('modifiedOn')
    .set(modifiedOn)
    .exec()
    .then((res) => res)
    .catch((err) => err);
};

export const approveReferral = async (id: string): Promise<Partial<Referral> | null> => {
  if (!id) return null;
  const modifiedOn = new Date().toISOString();
  return store
    .update(id)
    .updateAttribute('campaign')
    .set(CURRENT_CAMPAIGN)
    .updateAttribute('referralStatus')
    .set('active')
    .updateAttribute('referralApproved')
    .set(true)
    .updateAttribute('modifiedOn')
    .set(modifiedOn)
    .returnValues('UPDATED_NEW')
    .exec()
    .then((res) => res)
    .catch((err) => err);
};
