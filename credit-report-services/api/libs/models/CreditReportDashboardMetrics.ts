import { TransunionUtil as tu } from '@bravecredit/utilities';
import { CreditReport } from 'libs/models/CreditReport.model';
import { CreditReportWithMetrics } from 'libs/models/CreditReportWithMetrics';

export class CreditReportDashboardMetrics extends CreditReportWithMetrics {
  private report: CreditReport | undefined;
  constructor(report: CreditReport) {
    super(report);
    this.report = report;
    this.init();
  }

  countNegativeAccounts(): number {
    return this.tradelineRecords.reduce((a, b) => {
      return a + (tu.queries.report.isNegativeAccount(b) ? 1 : 0);
    }, 0);
  }
}
