import { DynamoStore } from '@shiftcoders/dynamo-easy';
import { CarouselAd } from 'lib/models/carouselAds.model';

const store = new DynamoStore(CarouselAd);

export const getCarouselAds = (): Promise<CarouselAd[]> => {
  return store
    .scan()
    .whereAttribute('active').equals(true)
    .execFetchAll()
    .then((res) => res)
    .catch((err) => err);
};
