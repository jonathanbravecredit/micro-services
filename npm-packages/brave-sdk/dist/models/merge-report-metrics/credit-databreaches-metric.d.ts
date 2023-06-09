import { DatabreachStatus } from '../../types';
import { MergeReport } from '../merge-report/merge-report';
import { CreditReportMetric } from './credit-report-metrics';
export declare class CreditDataBreachesMetric {
    private report;
    constructor(report: MergeReport);
    getMetric(): CreditReportMetric<number, DatabreachStatus>;
    count(): number;
    status(count: number): DatabreachStatus;
}
