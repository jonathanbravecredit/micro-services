import { MergeReport } from 'libs/models/MergeReport/MergeReport';

export class CreditReportMetrics {
  negativeAccounts = 0;
  constructor(private report: MergeReport) {}

  calcNegativeAccounts(): void {
    return;
  }
}
