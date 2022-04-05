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
exports.InvestigationResultQueries = void 0;
require("reflect-metadata");
const dynamo_easy_1 = require("@shiftcoders/dynamo-easy");
const investigation_result_1 = require("../../../models/investigation-result/investigation-result");
class InvestigationResultQueries {
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
exports.InvestigationResultQueries = InvestigationResultQueries;
InvestigationResultQueries.store = new dynamo_easy_1.DynamoStore(investigation_result_1.InvestigationResult);
