import { DynamoStore } from '@shiftcoders/dynamo-easy';
import { Ad } from 'lib/models/ads.model';

const store = new DynamoStore(Ad);

export const getAds = (): Promise<Ad[]> => {
  return store
    .scan()
    .whereAttribute('active').equals(true)
    .execFetchAll()
    .then((res) => res)
    .catch((err) => err);
};
