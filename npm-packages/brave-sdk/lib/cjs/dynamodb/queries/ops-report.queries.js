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
exports.OpsReportQueries = void 0;
const dynamo_easy_1 = require("@shiftcoders/dynamo-easy");
const ops_reports_1 = require("../models/ops-reports");
const store = new dynamo_easy_1.DynamoStore(ops_reports_1.OpsReport);
class OpsReportQueries {
    constructor() { }
    static listOpsReportsByBatch(batchId, reportId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.store
                .query()
                .index(ops_reports_1.BATCHID_REPORTID_INDEX)
                .wherePartitionKey(batchId)
                .whereSortKey()
                .equals(reportId)
                .execFetchAll();
        });
    }
    static listOpsReportByReportId(reportId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.store.query().wherePartitionKey(reportId).execFetchAll();
        });
    }
    static createOpReport(opsReport) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.store.put(opsReport).ifNotExists().exec();
        });
    }
    static deleteOpsReport(reportId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.store.delete(reportId).returnValues('ALL_OLD').exec();
        });
    }
    static batchDeleteOpsReport(records) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.store.batchWrite().delete(records).exec();
        });
    }
}
exports.OpsReportQueries = OpsReportQueries;
OpsReportQueries.store = new dynamo_easy_1.DynamoStore(ops_reports_1.OpsReport);
