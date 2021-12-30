import { APITransactionLog } from 'lib/models/api-transaction.model';
import {
  getTransactionLog,
  listTransactionLog,
  createTransactionLog,
} from 'lib/queries/logger/api-transaction.queries';
import Logger from 'lib/utils/logger/logger';
import * as uuid from 'uuid';

export default class TransactionLogger {
  constructor() {}
  logger = new Logger<APITransactionLog>(getTransactionLog, listTransactionLog, createTransactionLog);
  createTransaction(userId: string, action: string, transaction: string): APITransactionLog {
    const transactionId = uuid.v4();
    const createdOn = new Date().toISOString();
    return {
      userId,
      transactionId,
      action,
      transaction,
      createdOn,
    };
  }
}
