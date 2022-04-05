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
exports.CreditScoreQueries = void 0;
require("reflect-metadata");
const dynamo_easy_1 = require("@shiftcoders/dynamo-easy");
const credit_score_1 = require("../../../models/credit-score/credit-score");
class CreditScoreQueries {
    constructor() { }
    static getCreditScore(id, scoreId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.store.get(id, scoreId).exec();
        });
    }
    static listCreditScores() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.store.scan().execFetchAll();
        });
    }
    static createCreditScore(creditScore) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.store.put(creditScore).ifNotExists().exec();
        });
    }
    static deleteCreditScore(id, scoreId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.store.delete(id, scoreId).returnValues('ALL_OLD').exec();
        });
    }
}
exports.CreditScoreQueries = CreditScoreQueries;
CreditScoreQueries.store = new dynamo_easy_1.DynamoStore(credit_score_1.BraveCreditScore);
