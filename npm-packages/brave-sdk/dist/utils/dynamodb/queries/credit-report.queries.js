"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreditReportQueries = void 0;
require("reflect-metadata");
const dynamo_easy_1 = require("@shiftcoders/dynamo-easy");
const credit_report_1 = require("../../../models/credit-report/credit-report");
class CreditReportQueries {
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
exports.CreditReportQueries = CreditReportQueries;
CreditReportQueries.store = new dynamo_easy_1.DynamoStore(credit_report_1.CreditReport);
