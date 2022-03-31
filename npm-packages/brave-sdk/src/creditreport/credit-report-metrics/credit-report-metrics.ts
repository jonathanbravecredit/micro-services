import { MetricIds, MetricLabels } from '../../_types/credit-report-metrics';
import { MergeReport } from '../merge-report/merge-report';
import { CreditDataBreachesMetric } from './credit-databreaches-metric';
import { CreditForbearanceMetric } from './credit-forbearance-metric';
import { CreditMixMetric } from './credit-mix-metric';
import { CreditUtilizationMetric } from './credit-utilization-metric';
import { NegativeAccountsMetric } from './negative-accounts-metric';

export class CreditReportMetrics {
  metrics: CreditReportMetric<any, any>[] = [];
  constructor(private report: MergeReport) {}

  calculateMetrics(): CreditReportMetric<any, any>[] {
    const metric1 = new NegativeAccountsMetric(this.report).getMetric();
    const metric2 = new CreditMixMetric(this.report).getMetric();
    const metric3 = new CreditUtilizationMetric(this.report).getMetric();
    const metric4 = new CreditForbearanceMetric(this.report).getMetric();
    const metric5 = new CreditDataBreachesMetric(this.report).getMetric();
    this.metrics = [metric1, metric2, metric3, metric4, metric5];
    return this.metrics;
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
