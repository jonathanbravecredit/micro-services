import 'reflect-metadata';
import { attribute, DynamoStore } from '@shiftcoders/dynamo-easy';
import { TransactionData } from '../../../models/transaction-data/transactiondata';

export class TransactionDataQueries {
  static store = new DynamoStore(TransactionData);
  constructor() {}

  static async getTransaction(id: string, sortKey: string): Promise<TransactionData | null> {
    const now = new Date().valueOf() / 1000;
    return this.store
      .query()
      .wherePartitionKey(id)
      .whereSortKey()
      .eq(sortKey)
      .where(attribute('timeToLive').gte(now))
      .execSingle();
  }

  static async createTransaction(trans: TransactionData): Promise<void> {
    return this.store.put(trans).ifNotExists().exec();
  }

  static async deleteTransaction(id: string, sortKey: string): Promise<void> {
    return this.store.delete(id, sortKey).exec();
  }
}
