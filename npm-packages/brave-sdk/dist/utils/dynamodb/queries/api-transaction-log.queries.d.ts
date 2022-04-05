import 'reflect-metadata';
import { DynamoStore } from '@shiftcoders/dynamo-easy';
import { APITransactionLog } from '../../../models/api-transaction-log/api-transaction-log';
export declare class APITransactionLogQueries {
    static store: DynamoStore<APITransactionLog>;
    static getTransactionLog(userId: string, transactionid: string): Promise<APITransactionLog | null>;
    static listTransactionLog(userId: string): Promise<APITransactionLog[]>;
    static createTransactionLog(transaction: APITransactionLog): Promise<void>;
}
