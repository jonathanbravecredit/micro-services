import { TransunionUtil as tu } from '../../transunion/transunion';
import { ForbearanceStatus, MetricIds, MetricLabels } from '../../_types/credit-report-metrics';
import { MergeReport } from '../merge-report/merge-report';
import { CreditReportMetric } from './credit-report-metrics';

export class CreditForbearanceMetric {
  constructor(private report: MergeReport) {}

  getMetric(): CreditReportMetric<number, ForbearanceStatus> {
    const count = this.count();
    const status = this.status(count);
    return new CreditReportMetric<number, ForbearanceStatus>(
      MetricIds.Forbearance,
      MetricLabels.Forbearance,
      count,
      status,
    );
  }

  count(): number {
    const tradelines = this.report.TrueLinkCreditReportType?.TradeLinePartition || [];
    if (!tradelines || !tradelines.length) return 0;
    return tradelines.filter(tu.queries.report.isForbearanceAccount).length || 0;
  }

  status(count: number): ForbearanceStatus {
    return count ? 'danger' : 'safe';
  }
}
