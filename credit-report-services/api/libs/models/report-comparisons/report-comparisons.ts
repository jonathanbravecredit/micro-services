import * as _ from 'lodash';
import { CreditReport, CreditReportMetric, CreditReportMetrics, MetricIds } from '@bravecredit/brave-sdk';
import { Comparisons } from 'libs/models/report-comparisons/report-comparatives.interface';
import { ComparisonUpdates } from 'libs/models/report-comparisons/report-comparisons.constants';

export class ReportComparisons {
  priorMetrics: CreditReportMetric<any, any>[] = [];
  currMetrics: CreditReportMetric<any, any>[] = [];
  comparison: Comparisons = {} as Comparisons;
  metrics: MetricIds[] = [MetricIds.NegativeAccounts, MetricIds.CreditMix, MetricIds.CreditUtilization];

  constructor(private prior: CreditReport, private current: CreditReport) {
    _.bindAll(this, 'compare');
    this.priorMetrics = this.prior.metrics;
    this.currMetrics = this.current.metrics;
  }

  run(): void {
    this.check();
    console.log('current metricsss', this.currMetrics);
    console.log('prior metricsss', this.priorMetrics);
    console.log('this.metrics', this.metrics);
    this.metrics.forEach(this.compare);
  }

  compare(metric: MetricIds): void {
    const prior = this.priorMetrics.find((m) => m.metricId === metric);
    const current = this.currMetrics.find((m) => m.metricId === metric);
    console.log('current metric', current);
    console.log('prior metric', prior);
    const delta = prior?.metricValue != current?.metricValue ? ComparisonUpdates.Changed : ComparisonUpdates.NoChange;
    this.comparison[metric] = {
      priorValue: prior?.metricValue || null,
      currentValue: current?.metricValue || null,
      delta,
    };
  }

  check(): void {
    if (!this.priorMetrics || this.priorMetrics.length === 0) {
      const prior = new CreditReportMetrics(this.prior.report).calculateMetrics();
      this.priorMetrics = prior;
    }
    if (!this.currMetrics || this.currMetrics.length === 0) {
      const current = new CreditReportMetrics(this.current.report).calculateMetrics();
      this.currMetrics = current;
    }
  }
}
