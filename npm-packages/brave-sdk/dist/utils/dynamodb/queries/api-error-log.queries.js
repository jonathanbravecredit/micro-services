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
exports.APIErrorLogQueries = void 0;
require("reflect-metadata");
const dynamo_easy_1 = require("@shiftcoders/dynamo-easy");
const api_error_log_1 = require("../../../models/api-error-log/api-error-log");
class APIErrorLogQueries {
    constructor() { }
    static getErrorLog(userId, errorId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.store.get(userId, errorId).exec();
        });
    }
    static listErrorLog(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.store.query().wherePartitionKey(userId).execFetchAll();
        });
    }
    static createErrorLog(error) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdOn = new Date().toISOString();
            const newError = Object.assign(Object.assign({}, error), { createdOn });
            return this.store.put(newError).ifNotExists().exec();
        });
    }
}
exports.APIErrorLogQueries = APIErrorLogQueries;
APIErrorLogQueries.store = new dynamo_easy_1.DynamoStore(api_error_log_1.APIErrorLog);
