import { DynamoStore } from '@shiftcoders/dynamo-easy';
import { CreditScore } from 'libs/models/credit-scores.model';

const store = new DynamoStore(CreditScore);

export const getCreditScore = (id: string, scoreId: number): Promise<CreditScore | null> => {
  return store
    .get(id, scoreId)
    .exec()
    .then((res) => res)
    .catch((err) => err);
};

export const getAllCreditScore = (id: string): Promise<CreditScore | null> => {
  return store
    .get(id)
    .exec()
    .then((res) => res)
    .catch((err) => err);
};

export const listCreditScores = (): Promise<CreditScore[]> => {
  return store
    .scan()
    .execFetchAll()
    .then((res) => res)
    .catch((err) => err);
};

export const createCreditScore = (creditScore: CreditScore): Promise<void> => {
  return store
    .put(creditScore)
    .ifNotExists()
    .exec()
    .then((res) => res)
    .catch((err) => err);
};

export const deleteCreditScore = (id: string, scoreId: number): Promise<CreditScore> => {
  return store
    .delete(id, scoreId)
    .returnValues('ALL_OLD')
    .exec()
    .then((res) => res)
    .catch((err) => err);
};
