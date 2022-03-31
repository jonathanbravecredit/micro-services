import 'reflect-metadata';
import { IMergeReport } from '../../_types/merge-report';
export declare class CreditReport {
    userId: string;
    version: number;
    currentVersion: number | undefined;
    bureau: string;
    report: IMergeReport;
    createdOn: string | null;
    modifiedOn: string | null;
}
export declare class CreditReportMaker implements CreditReport {
    userId: string;
    bureau: string;
    report: IMergeReport;
    version: number;
    createdOn: string | null;
    modifiedOn: string | null;
    currentVersion: number | undefined;
    constructor(userId: string, bureau: string, report: IMergeReport, version?: number);
    setCurrentVersion(val: number): void;
}
