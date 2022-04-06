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
exports.AnalyticQueries = void 0;
require("reflect-metadata");
const dynamo_easy_1 = require("@shiftcoders/dynamo-easy");
const analytic_1 = require("../../../models/analytic/analytic");
class AnalyticQueries {
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
exports.AnalyticQueries = AnalyticQueries;
AnalyticQueries.store = new dynamo_easy_1.DynamoStore(analytic_1.Analytic);
