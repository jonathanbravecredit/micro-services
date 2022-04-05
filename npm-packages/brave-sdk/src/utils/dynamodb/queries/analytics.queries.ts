import 'reflect-metadata';
import { DynamoStore } from '@shiftcoders/dynamo-easy';
import { Analytic } from '../../../models/analytic/analytic';

export class AnalyticQueries {
  static store = new DynamoStore(Analytic);
  constructor() {}

  static async getAnalytic(analyticId: string): Promise<Analytic | null> {
    return this.store.get(analyticId).exec();
  }

  static async listAnalytics(): Promise<Analytic[]> {
    return this.store.scan().execFetchAll();
  }
  static async createAnalytic(Analytics: Analytic): Promise<void> {
    return this.store.put(Analytics).ifNotExists().exec();
  }

  static async deleteAnalytic(analyticId: string): Promise<Analytic> {
    return this.store.delete(analyticId).returnValues('ALL_OLD').exec();
  }
}
