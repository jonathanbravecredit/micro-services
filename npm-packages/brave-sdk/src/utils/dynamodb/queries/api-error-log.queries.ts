import 'reflect-metadata';
import { DynamoStore } from '@shiftcoders/dynamo-easy';
import { APIErrorLog } from '../../../models/api-error-log/api-error-log';

export class APIErrorLogQueries {
  static store = new DynamoStore(APIErrorLog);
  constructor() {}

  static async getErrorLog(userId: string, errorId: string): Promise<APIErrorLog | null> {
    return this.store.get(userId, errorId).exec();
  }
  static async listErrorLog(userId: string): Promise<APIErrorLog[]> {
    return this.store.query().wherePartitionKey(userId).execFetchAll();
  }
  static async createErrorLog(error: APIErrorLog): Promise<void> {
    const createdOn = new Date().toISOString();
    const newError = {
      ...error,
      createdOn,
    };
    return this.store.put(newError).ifNotExists().exec();
  }
}
