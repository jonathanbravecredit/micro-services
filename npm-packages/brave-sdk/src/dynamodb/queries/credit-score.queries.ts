import 'reflect-metadata';
import { DynamoStore } from '@shiftcoders/dynamo-easy';
import { CreditScore } from '../models/credit-score.model';

export class CreditScoreQueries {
  static store = new DynamoStore(CreditScore);
  constructor() {}
  static async getCreditScore(id: string, scoreId: number): Promise<CreditScore | null> {
    return this.store.get(id, scoreId).exec();
  }
  static async listCreditScores(): Promise<CreditScore[]> {
    return this.store.scan().execFetchAll();
  }
  static async createCreditScore(creditScore: CreditScore): Promise<void> {
    return this.store.put(creditScore).ifNotExists().exec();
  }

  static async deleteCreditScore(id: string, scoreId: number): Promise<CreditScore> {
    return this.store.delete(id, scoreId).returnValues('ALL_OLD').exec();
  }
}
