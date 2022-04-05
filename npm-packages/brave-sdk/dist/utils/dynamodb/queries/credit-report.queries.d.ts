import 'reflect-metadata';
import { DynamoStore } from '@shiftcoders/dynamo-easy';
import { CreditReport } from '../../../models/credit-report/credit-report';
export declare class CreditReportQueries {
    static store: DynamoStore<CreditReport>;
    constructor();
    static getReport(userId: string, version: number): Promise<CreditReport | null>;
    static getCurrentReport(userId: string): Promise<CreditReport | null>;
    static createReport(report: CreditReport): Promise<void>;
    static updateReport(report: CreditReport): Promise<void>;
    static listReports(sub: string): Promise<CreditReport[]>;
    static listLastTwoReports(sub: string): Promise<CreditReport[]>;
}
