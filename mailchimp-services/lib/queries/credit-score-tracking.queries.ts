import { PutItemOutput, DeleteItemOutput } from 'aws-sdk/clients/dynamodb';
import { DynamoStore } from '@shiftcoders/dynamo-easy';
import { CreditScoreTracking } from 'lib/models/credit-score-tracking';

const store = new DynamoStore(CreditScoreTracking);

export const getCreditScoreTracking = (userId: string, bureauId: string): Promise<CreditScoreTracking> => {
  return store
    .get(userId, bureauId)
    .exec()
    .then((res) => res)
    .catch((err) => err);
};

export const listCreditScoresTrackings = (): Promise<CreditScoreTracking[]> => {
  return store
    .scan()
    .execFetchAll()
    .then((res) => res)
    .catch((err) => err);
};

export const createCreditScoreTracking = (score: CreditScoreTracking): Promise<PutItemOutput> => {
  const createdOn = new Date().toISOString();
  const newScore = {
    ...score,
    createdOn,
    modifiedOn: createdOn,
  };
  return store
    .put(newScore)
    .ifNotExists()
    .exec()
    .then((res) => res)
    .catch((err) => err);
};

export const updateCreditScoreTracking = (score: CreditScoreTracking): Promise<PutItemOutput> => {
  const modifiedOn = new Date().toISOString();
  const newScore = {
    ...score,
    modifiedOn,
  };
  return store
    .put(newScore)
    .exec()
    .then((res) => res)
    .catch((err) => err);
};

export const deleteCreditScoreTracking = (userId: string, bureauId: string): Promise<DeleteItemOutput> => {
  return store
    .delete(userId, bureauId)
    .exec()
    .then((res) => res)
    .catch((err) => err);
};
