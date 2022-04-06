import 'reflect-metadata';
import { DynamoStore } from '@shiftcoders/dynamo-easy';
import { BraveCreditScore } from '../../../models/credit-score/credit-score';

export class CreditScoreQueries {
  static store = new DynamoStore(BraveCreditScore);
  constructor() {}
  static async getCreditScore(id: string, scoreId: number): Promise<BraveCreditScore | null> {
    return this.store.get(id, scoreId).exec();
  }
  static async listCreditScores(): Promise<BraveCreditScore[]> {
    return this.store.scan().execFetchAll();
  }
  static async createCreditScore(creditScore: BraveCreditScore): Promise<void> {
    return this.store.put(creditScore).ifNotExists().exec();
  }

  static async deleteCreditScore(id: string, scoreId: number): Promise<BraveCreditScore> {
    return this.store.delete(id, scoreId).returnValues('ALL_OLD').exec();
  }
}
