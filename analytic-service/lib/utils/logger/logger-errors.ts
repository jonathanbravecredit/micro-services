import { APIErrorLog } from 'lib/models/api-error.model';
import { getErrorLog, listErrorLog, createErrorLog } from 'lib/queries/logger/api-error.queries';
import Logger from 'lib/utils/logger/logger';
import * as uuid from 'uuid';

export default class ErrorLogger {
  constructor() {}
  logger = new Logger<APIErrorLog>(getErrorLog, listErrorLog, createErrorLog);

  createError(userId: string, action: string, error: string): APIErrorLog {
    const errorId = uuid.v4();
    const createdOn = new Date().toISOString();
    return {
      userId,
      errorId,
      action,
      error,
      createdOn,
    };
  }
}
