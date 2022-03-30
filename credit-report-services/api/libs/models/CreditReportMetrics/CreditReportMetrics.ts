import { IMergeReport } from 'libs/interfaces/merge-report.interface';

export class CreditReportMetrics {
  negativeAccounts = 0;
  constructor(private report: IMergeReport) {}

  calcNegativeAccounts(): void {
    return;
  }
}
