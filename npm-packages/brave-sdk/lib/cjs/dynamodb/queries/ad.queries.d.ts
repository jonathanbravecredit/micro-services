import 'reflect-metadata';
import { DynamoStore } from '@shiftcoders/dynamo-easy';
import { Ad } from '../models/ad.model';
export declare class AdsQueries {
    static store: DynamoStore<Ad>;
    static listAds(): Promise<Ad[]>;
}
