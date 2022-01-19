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

export const createReferral = (referral: Referral): Promise<void> => {
  return store
    .put(referral)
    .ifNotExists()
    .exec()
    .then((res) => res)
    .catch((err) => err);
};
