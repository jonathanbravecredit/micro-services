import { ForbearanceStatus } from '../../_types/credit-report-metrics';
import { MergeReport } from '../merge-report/merge-report';
import { CreditReportMetric } from './credit-report-metrics';
export declare class CreditForbearanceMetric {
    private report;
    constructor(report: MergeReport);
    getMetric(): CreditReportMetric<number, ForbearanceStatus>;
    count(): number;
    status(count: number): ForbearanceStatus;
}
