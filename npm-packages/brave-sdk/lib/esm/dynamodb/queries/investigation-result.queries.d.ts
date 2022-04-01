import 'reflect-metadata';
import { DynamoStore } from '@shiftcoders/dynamo-easy';
import { InvestigationResult } from '../models/investigation-result.model';
export declare class InvestigationResultQueries {
    static store: DynamoStore<InvestigationResult>;
    constructor();
    static getInvestigationResult(id: string, userId: string): Promise<InvestigationResult | null>;
    static createInvestigationResult(report: InvestigationResult): Promise<void>;
    static updateInvestigationResult(report: InvestigationResult): Promise<void>;
    static deleteInvestigationResult(id: string, userId: string): Promise<InvestigationResult>;
}
