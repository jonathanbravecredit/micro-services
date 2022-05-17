import { CreditReport, CreditReportMetric, CreditReportMetrics, MetricIds } from '@bravecredit/brave-sdk';
import { ComparativeUpdates } from 'libs/models/report-comparatives/report-comparatives.constants';
import { Comparatives } from 'libs/models/report-comparatives/report-comparatives.interface';

export class ReportComparatives {
  priorMetrics: CreditReportMetric<any, any>[] = [];
  currMetrics: CreditReportMetric<any, any>[] = [];
  comparatives: Comparatives = {} as Comparatives;
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
    const delta = prior?.metricValue != current?.metricValue ? ComparativeUpdates.Changed : ComparativeUpdates.NoChange;
    this.comparatives[metric] = {
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
