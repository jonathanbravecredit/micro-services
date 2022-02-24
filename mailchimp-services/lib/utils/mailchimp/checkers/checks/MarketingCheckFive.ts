import { CreditReport } from 'lib/interfaces/credit-report.interface';
import { CreditReportChecker } from 'lib/utils/mailchimp/checkers/CreditReportChecker';
import { IMarketingCheckerResults } from 'lib/utils/mailchimp/interfaces';
import { CreditReportMetrics } from 'lib/utils/transunion/CreditReportMetrics';

export class MarketingCheckFive extends CreditReportChecker {
  constructor(event: 'MODIFY' | 'INSERT', current: CreditReport, prior: CreditReport | null) {
    super(event, current, prior);
  }

  check(): IMarketingCheckerResults {
    if (this.event !== 'MODIFY') return this.generateResults(false);
    if (!this.currCreditReport) return this.generateResults(false);

    const current = new CreditReportMetrics(this.currCreditReport);
    current.aggregate();
    const negatives = current.metrics.countDerogatoryAccounts;
    const tags = negatives
      ? [this.generateTag('negative_account(s)', 'active'), this.generateTag('negative_account(s)', 'inactive')]
      : [this.generateTag('negative_account(s)', 'inactive'), this.generateTag('negative_account(s)', 'active')];
    return this.generateResults(true, tags);
  }
}
