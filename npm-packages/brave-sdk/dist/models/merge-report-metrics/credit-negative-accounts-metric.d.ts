import { NegativeAccountStatus } from '../../types';
import { MergeReport } from '../merge-report/merge-report';
import { CreditReportMetric } from './credit-report-metrics';
export declare class CreditNegativeAccountsMetric {
    private report;
    constructor(report: MergeReport);
    getMetric(): CreditReportMetric<number, NegativeAccountStatus>;
    count(): number;
    status(count: number): NegativeAccountStatus;
}
