import 'reflect-metadata';
import { DynamoStore } from '@shiftcoders/dynamo-easy';
import { BraveCreditScore } from '../../../models/credit-score/credit-score';
export declare class CreditScoreQueries {
    static store: DynamoStore<BraveCreditScore>;
    constructor();
    static getCreditScore(id: string, scoreId: number): Promise<BraveCreditScore | null>;
    static listCreditScores(): Promise<BraveCreditScore[]>;
    static createCreditScore(creditScore: BraveCreditScore): Promise<void>;
    static deleteCreditScore(id: string, scoreId: number): Promise<BraveCreditScore>;
}
