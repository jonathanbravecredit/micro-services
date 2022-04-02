import 'reflect-metadata';
import { DynamoStore } from '@shiftcoders/dynamo-easy';
import { Ad } from '../../../models/ad/ad';

export class AdsQueries {
  static store = new DynamoStore(Ad);

  static async listAds(): Promise<Ad[]> {
    return this.store.scan().whereAttribute('active').equals(true).execFetchAll();
  }
}
