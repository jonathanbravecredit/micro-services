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
import { CreditReport } from '../models/credit-report.model';
export class CreditReportQueries {
    constructor() { }
    static getReport(userId, version) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.store.get(userId, version).exec();
        });
    }
    static getCurrentReport(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.store.get(userId, 0).exec();
        });
    }
    static createReport(report) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdOn = new Date().toISOString();
            const creditReport = Object.assign(Object.assign({}, report), { createdOn, modifiedOn: createdOn });
            return this.store.put(creditReport).ifNotExists().exec();
        });
    }
    static updateReport(report) {
        return __awaiter(this, void 0, void 0, function* () {
            const modifiedOn = new Date().toISOString();
            const newDispute = Object.assign(Object.assign({}, report), { modifiedOn });
            return this.store.put(newDispute).exec();
        });
    }
    static listReports(sub) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.store.query().wherePartitionKey(sub).descending().execFetchAll();
        });
    }
    static listLastTwoReports(sub) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.store.query().wherePartitionKey(sub).descending().limit(2).execFetchAll();
        });
    }
}
CreditReportQueries.store = new DynamoStore(CreditReport);
