import 'reflect-metadata';
import { DynamoStore } from '@shiftcoders/dynamo-easy';
import { CreditReport } from '../models/credit-report.model';

export class CreditReportQueries {
  static store = new DynamoStore(CreditReport);
  constructor() {}

  static async getReport(userId: string, version: number): Promise<CreditReport | null> {
    return this.store.get(userId, version).exec();
  }

  static async getCurrentReport(userId: string): Promise<CreditReport | null> {
    return this.store.get(userId, 0).exec();
  }

  static async createReport(report: CreditReport): Promise<void> {
    const createdOn = new Date().toISOString();
    const creditReport = {
      ...report,
      createdOn,
      modifiedOn: createdOn,
    };
    return this.store.put(creditReport).ifNotExists().exec();
  }

  static async updateReport(report: CreditReport): Promise<void> {
    const modifiedOn = new Date().toISOString();
    const newDispute = {
      ...report,
      modifiedOn,
    };
    return this.store.put(newDispute).exec();
  }

  static async listReports(sub: string): Promise<CreditReport[]> {
    return this.store.query().wherePartitionKey(sub).descending().execFetchAll();
  }

  static async listLastTwoReports(sub: string): Promise<CreditReport[]> {
    return this.store.query().wherePartitionKey(sub).descending().limit(2).execFetchAll();
  }
}
