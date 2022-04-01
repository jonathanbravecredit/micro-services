import { DatabreachStatus } from '../../_types/credit-report-metrics';
import { MergeReport } from '../merge-report/merge-report';
import { CreditReportMetric } from './credit-report-metrics';
export declare class CreditDataBreachesMetric {
    private report;
    constructor(report: MergeReport);
    getMetric(): CreditReportMetric<number, DatabreachStatus>;
    count(): number;
    status(count: number): DatabreachStatus;
}
