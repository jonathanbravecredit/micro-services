import 'reflect-metadata';
import { MergeReport } from '../merge-report/merge-report';
import { CreditReportMetric } from '../merge-report-metrics';
export declare class CreditReport {
    userId: string;
    version: number;
    currentVersion: number | undefined;
    bureau: string;
    report: MergeReport;
    metrics: CreditReportMetric<any, any>[];
    createdOn: string | null;
    modifiedOn: string | null;
}
export declare class CreditReportMaker implements CreditReport {
    userId: string;
    bureau: string;
    report: MergeReport;
    version: number;
    createdOn: string | null;
    modifiedOn: string | null;
    currentVersion: number | undefined;
    metrics: CreditReportMetric<any, any>[];
    constructor(userId: string, bureau: string, report: MergeReport, version?: number);
    setCurrentVersion(val: number): void;
}
