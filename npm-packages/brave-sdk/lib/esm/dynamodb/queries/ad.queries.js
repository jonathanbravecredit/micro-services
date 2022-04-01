var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import 'reflect-metadata';
import { DynamoStore } from '@shiftcoders/dynamo-easy';
import { Ad } from '../models/ad.model';
export class AdsQueries {
    static listAds() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.store.scan().whereAttribute('active').equals(true).execFetchAll();
        });
    }
}
AdsQueries.store = new DynamoStore(Ad);
