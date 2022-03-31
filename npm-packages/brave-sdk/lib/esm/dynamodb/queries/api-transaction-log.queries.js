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
import { APITransactionLog } from '../models/api-transaction-log.model';
export class APITransactionLogQueries {
    static getTransactionLog(userId, transactionid) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.store.get(userId, transactionid).exec();
        });
    }
    static listTransactionLog(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.store.query().wherePartitionKey(userId).execFetchAll();
        });
    }
    static createTransactionLog(transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdOn = new Date().toISOString();
            const newTransaction = Object.assign(Object.assign({}, transaction), { createdOn });
            return this.store.put(newTransaction).ifNotExists().exec();
        });
    }
}
APITransactionLogQueries.store = new DynamoStore(APITransactionLog);
