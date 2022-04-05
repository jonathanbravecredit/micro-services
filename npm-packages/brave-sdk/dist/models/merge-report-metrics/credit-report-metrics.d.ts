import { MergeReport } from '../merge-report/merge-report';
import { MetricIds, MetricLabels } from '../../constants/transunion';
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
