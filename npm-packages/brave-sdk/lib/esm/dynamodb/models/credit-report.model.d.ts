import 'reflect-metadata';
import { MergeReport } from '../../creditreport/merge-report/merge-report';
import { CreditReportMetrics } from '../../creditreport/credit-report-metrics/credit-report-metrics';
export declare class CreditReport {
    userId: string;
    version: number;
    currentVersion: number | undefined;
    bureau: string;
    report: MergeReport;
    metrics: CreditReportMetrics[];
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
    metrics: CreditReportMetrics[];
    constructor(userId: string, bureau: string, report: MergeReport, version?: number);
    setCurrentVersion(val: number): void;
}
