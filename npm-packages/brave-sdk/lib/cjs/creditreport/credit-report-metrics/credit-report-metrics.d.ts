import { MetricIds, MetricLabels } from '../../_types/credit-report-metrics';
import { MergeReport } from '../merge-report/merge-report';
export declare class CreditReportMetrics {
    private report;
    metrics: CreditReportMetric<any, any>[];
    constructor(report: MergeReport);
    calculateMetrics(): CreditReportMetric<any, any>[];
}
export declare class CreditReportMetric<V, S> {
    metricId: MetricIds;
    metricLabel: MetricLabels;
    metricValue: V;
    metricStatus: S;
    constructor(metricId: MetricIds, metricLabel: MetricLabels, metricValue: V, metricStatus: S);
}
