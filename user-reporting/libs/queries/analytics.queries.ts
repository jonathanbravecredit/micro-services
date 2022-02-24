import { DynamoStore } from '@shiftcoders/dynamo-easy';
import { Analytics } from 'libs/models/analytics.model';

const store = new DynamoStore(Analytics);

export const getAnalytics = (analyticId: string): Promise<Analytics | null> => {
  return store
    .get(analyticId)
    .exec()
    .then((res) => res)
    .catch((err) => err);
};

export const listAnalytics = (): Promise<Analytics[]> => {
  return store
    .scan()
    .execFetchAll()
    .then((res) => res)
    .catch((err) => err);
};

export const createAnalytics = (Analytics: Analytics): Promise<void> => {
  return store
    .put(Analytics)
    .ifNotExists()
    .exec()
    .then((res) => res)
    .catch((err) => err);
};

export const deleteAnalytics = (analyticId: string): Promise<Analytics> => {
  return store
    .delete(analyticId)
    .returnValues('ALL_OLD')
    .exec()
    .then((res) => res)
    .catch((err) => err);
};
