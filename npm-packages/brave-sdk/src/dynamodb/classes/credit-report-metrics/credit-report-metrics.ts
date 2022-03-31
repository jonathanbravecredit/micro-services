import { MetricIds, MetricLabels } from '../../../_types/credit-report-metrics';
import { MergeReport } from '../merge-report/merge-report';
import { CreditMixMetric } from './credit-mix-metric';
import { NegativeAccountsMetric } from './negative-accounts-metric';

export class CreditReportMetrics {
  metrics: CreditReportMetric<any, any>[] = [];
  constructor(private report: MergeReport) {}

  calculateMetrics(): CreditReportMetric<any, any>[] {
    const metric1 = new NegativeAccountsMetric(this.report).getMetric();
    const metric2 = new CreditMixMetric(this.report).getMetric();
    this.metrics = [metric1, metric2];
    return [];
  }
}

export class CreditReportMetric<V, S> {
  constructor(
    public metricId: MetricIds,
    public metricLabel: MetricLabels,
    public metricValue: V,
    public metricStatus: S,
  ) {}
}
