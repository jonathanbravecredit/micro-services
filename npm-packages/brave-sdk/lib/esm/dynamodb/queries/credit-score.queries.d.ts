import 'reflect-metadata';
import { DynamoStore } from '@shiftcoders/dynamo-easy';
import { CreditScore } from '../models/credit-score.model';
export declare class CreditScoreQueries {
    static store: DynamoStore<CreditScore>;
    constructor();
    static getCreditScore(id: string, scoreId: number): Promise<CreditScore | null>;
    static listCreditScores(): Promise<CreditScore[]>;
    static createCreditScore(creditScore: CreditScore): Promise<void>;
    static deleteCreditScore(id: string, scoreId: number): Promise<CreditScore>;
}
