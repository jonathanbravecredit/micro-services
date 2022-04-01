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
import { InvestigationResult } from '../models/investigation-result.model';
export class InvestigationResultQueries {
    constructor() { }
    static getInvestigationResult(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.store.get(id, userId).exec();
        });
    }
    static createInvestigationResult(report) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdOn = new Date().toISOString();
            const newReport = Object.assign(Object.assign({}, report), { createdOn, modifiedOn: createdOn });
            return this.store.put(newReport).ifNotExists().exec();
        });
    }
    static updateInvestigationResult(report) {
        return __awaiter(this, void 0, void 0, function* () {
            const modifiedOn = new Date().toISOString();
            const newReport = Object.assign(Object.assign({}, report), { modifiedOn });
            return this.store.put(newReport).exec();
        });
    }
    static deleteInvestigationResult(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.store.delete(id, userId).returnValues('ALL_OLD').exec();
        });
    }
}
InvestigationResultQueries.store = new DynamoStore(InvestigationResult);
