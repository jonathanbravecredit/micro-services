import { CreditReport, CreditReportMetric, CreditReportMetrics, MetricIds } from '@bravecredit/brave-sdk';
import { Comparisons } from 'libs/models/report-comparisons/report-comparatives.interface';
import { ComparisonUpdates } from 'libs/models/report-comparisons/report-comparisons.constants';

export class ReportComparisons {
  priorMetrics: CreditReportMetric<any, any>[] = [];
  currMetrics: CreditReportMetric<any, any>[] = [];
  comparison: Comparisons = {} as Comparisons;
  metrics: MetricIds[] = [MetricIds.NegativeAccounts, MetricIds.CreditMix, MetricIds.CreditUtilization];

  constructor(private prior: CreditReport, private current: CreditReport) {
    this.priorMetrics = this.prior.metrics;
    this.currMetrics = this.current.metrics;
  }

  run(): void {
    this.check();
    this.metrics.forEach((m) => {
      this.compare(m);
    });
  }

  compare(metric: MetricIds): void {
    const prior = this.priorMetrics.find((m) => m.metricId === metric);
    const current = this.currMetrics.find((m) => m.metricId === metric);
    const delta = prior?.metricValue != current?.metricValue ? ComparisonUpdates.Changed : ComparisonUpdates.NoChange;
    this.comparison[metric] = {
      priorValue: prior?.metricValue || null,
      currentValue: current?.metricValue || null,
      delta,
    };
  }

  check(): void {
    if (!this.priorMetrics || this.priorMetrics.length === 0) {
      const metrics = new CreditReportMetrics(this.prior.report).calculateMetrics();
      this.priorMetrics = metrics;
    }
    if (!this.currMetrics || this.currMetrics.length === 0) {
      const metrics = new CreditReportMetrics(this.current.report).calculateMetrics();
      this.currMetrics = metrics;
    }
  }
}
