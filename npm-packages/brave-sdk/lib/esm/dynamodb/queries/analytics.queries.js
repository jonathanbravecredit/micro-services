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
import { Analytic } from '../models/analytic.model';
export class AnalyticQueries {
    constructor() { }
    static getAnalytic(analyticId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.store.get(analyticId).exec();
        });
    }
    static listAnalytics() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.store.scan().execFetchAll();
        });
    }
    static createAnalytic(Analytics) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.store.put(Analytics).ifNotExists().exec();
        });
    }
    static deleteAnalytic(analyticId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.store.delete(analyticId).returnValues('ALL_OLD').exec();
        });
    }
}
AnalyticQueries.store = new DynamoStore(Analytic);
