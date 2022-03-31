import { TransunionUtil as tu } from '../../transunion/transunion';
import { DatabreachStatus, MetricIds, MetricLabels } from '../../_types/credit-report-metrics';
import { MergeReport } from '../merge-report/merge-report';
import { CreditReportMetric } from './credit-report-metrics';

export class CreditDataBreachesMetric {
  constructor(private report: MergeReport) {}

  getMetric(): CreditReportMetric<number, DatabreachStatus> {
    const count = this.count();
    const status = this.status(count);
    return new CreditReportMetric<number, DatabreachStatus>(
      MetricIds.Databreaches,
      MetricLabels.Databreaches,
      count,
      status,
    );
  }

  count(): number {
    const tradelines = this.report.TrueLinkCreditReportType?.TradeLinePartition || [];
    if (!tradelines || !tradelines.length) return 0;
    const breaches = tu.queries.report.listDataBreaches(this.report);
    return breaches.length;
  }

  status(count: number): DatabreachStatus {
    return count ? 'danger' : 'safe';
  }
}
