import * as _ from 'lodash';
import { CreditReport, CreditReportMetric, CreditReportMetrics, MetricIds } from '@bravecredit/brave-sdk';
import { Comparisons } from 'libs/models/report-comparisons/report-comparatives.interface';
import { ComparisonUpdates } from 'libs/models/report-comparisons/report-comparisons.constants';

export class ReportComparisons {
  priorMetrics: CreditReportMetric<unknown, unknown>[] = [];
  currMetrics: CreditReportMetric<unknown, unknown>[] = [];
  comparison: Comparisons = {} as Comparisons;
  metrics: string[] = ['negative_accounts', 'credit_mix', 'credit_utilization'];
  constructor(public prior: CreditReport, public current: CreditReport) {
    console.log('here 0');
    console.log('metrics array', this.metrics);
    _.bindAll(this, 'compare');
    this.priorMetrics = this.prior.metrics || [];
    this.currMetrics = this.current.metrics || [];
    console.log('current metricsss', this.currMetrics);
    console.log('prior metricsss', this.priorMetrics);
  }

  run(): void {
    console.log('in run');
    this.check();
    console.log('current metricsss', this.currMetrics);
    console.log('prior metricsss', this.priorMetrics);
    console.log('this.metrics', this.metrics);
    this.metrics.forEach(this.compare);
  }

  compare(metric: string): void {
    const prior = this.priorMetrics.find((m) => m.metricId === metric);
    const current = this.currMetrics.find((m) => m.metricId === metric);
    console.log('current metric', current);
    console.log('prior metric', prior);
    const delta = prior?.metricValue != current?.metricValue ? ComparisonUpdates.Changed : ComparisonUpdates.NoChange;
    const data = {
      [metric]: {
        priorValue: prior?.metricValue || null,
        currentValue: current?.metricValue || null,
        delta,
      },
    };
    this.comparison = _.merge(this.comparison, data);
    console.log('this.comparison', this.comparison);
  }

  check(): void {
    if (this.priorMetrics.length === 0) {
      console.log('here 1');
      const prior = new CreditReportMetrics(this.prior.report).calculateMetrics();
      console.log('prior metrics', prior);
      this.priorMetrics = prior;
    }
    if (this.currMetrics.length === 0) {
      console.log('here 2');
      const current = new CreditReportMetrics(this.current.report).calculateMetrics();
      console.log('current metrics', current);
      this.currMetrics = current;
    }
  }
}
