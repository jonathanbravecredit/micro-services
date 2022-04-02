import 'reflect-metadata';
import { DynamoStore } from '@shiftcoders/dynamo-easy';
import { APITransactionLog } from '../../../models/api-transaction-log/api-transaction-log';

export class APITransactionLogQueries {
  static store = new DynamoStore(APITransactionLog);

  static async getTransactionLog(userId: string, transactionid: string): Promise<APITransactionLog | null> {
    return this.store.get(userId, transactionid).exec();
  }

  static async listTransactionLog(userId: string): Promise<APITransactionLog[]> {
    return this.store.query().wherePartitionKey(userId).execFetchAll();
  }

  static async createTransactionLog(transaction: APITransactionLog): Promise<void> {
    const createdOn = new Date().toISOString();
    const newTransaction = {
      ...transaction,
      createdOn,
    };
    return this.store.put(newTransaction).ifNotExists().exec();
  }
}
