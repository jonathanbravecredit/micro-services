import { MetricIds, MetricLabels } from '../../constants/transunion';
import { TransunionUtil as tu } from '../../utils/transunion/transunion';
import { NegativeAccountStatus } from '../../types';
import { MergeReport } from '../merge-report/merge-report';
import { CreditReportMetric } from './credit-report-metrics';

export class CreditNegativeAccountsMetric {
  constructor(private report: MergeReport) {}

  getMetric(): CreditReportMetric<number, NegativeAccountStatus> {
    const count = this.count();
    const status = this.status(count);
    return new CreditReportMetric<number, NegativeAccountStatus>(
      MetricIds.NegativeAccounts,
      MetricLabels.NegativeAccounts,
      count,
      status,
    );
  }

  count(): number {
    const tradelines = this.report.TrueLinkCreditReportType?.TradeLinePartition || [];
    if (!tradelines || !tradelines.length) return 0;
    return tradelines.filter(tu.queries.report.isNegativeAccount).length || 0;
  }

  status(count: number): NegativeAccountStatus {
    return count ? 'critical' : 'safe';
  }
}
