import { MetricIds, MetricLabels } from '../../_types/credit-report-metrics';
import { MergeReport } from '../merge-report/merge-report';
/**
 * Class to compile the 5 summary metrics from the MergeReport
 * @constructor MergeReport
 * @method calculateMetrics required to run and pull the metrics
 */
export declare class CreditReportMetrics {
    private report;
    metrics: CreditReportMetric<any, any>[];
    constructor(report: MergeReport);
    /**
     *
     * @returns CreditReportMetric Array
     */
    calculateMetrics(): CreditReportMetric<any, any>[];
}
export declare class CreditReportMetric<V, S> {
    metricId: MetricIds;
    metricLabel: MetricLabels;
    metricValue: V;
    metricStatus: S;
    constructor(metricId: MetricIds, metricLabel: MetricLabels, metricValue: V, metricStatus: S);
}
