import { MetricIds, MetricLabels } from '../../constants/transunion';
import { TransunionUtil as tu } from '../../utils/transunion/transunion';
import { ForbearanceStatus } from '../../types';
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
