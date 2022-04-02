import 'reflect-metadata';
import { DynamoStore } from '@shiftcoders/dynamo-easy';
import { InvestigationResult } from '../../../models/investigation-result/investigation-result';

export class InvestigationResultQueries {
  static store = new DynamoStore(InvestigationResult);

  constructor() {}

  static async getInvestigationResult(id: string, userId: string): Promise<InvestigationResult | null> {
    return this.store.get(id, userId).exec();
  }

  static async createInvestigationResult(report: InvestigationResult): Promise<void> {
    const createdOn = new Date().toISOString();
    const newReport = {
      ...report,
      createdOn,
      modifiedOn: createdOn,
    };
    return this.store.put(newReport).ifNotExists().exec();
  }

  static async updateInvestigationResult(report: InvestigationResult): Promise<void> {
    const modifiedOn = new Date().toISOString();
    const newReport = {
      ...report,
      modifiedOn,
    };
    return this.store.put(newReport).exec();
  }

  static async deleteInvestigationResult(id: string, userId: string): Promise<InvestigationResult> {
    return this.store.delete(id, userId).returnValues('ALL_OLD').exec();
  }
}
