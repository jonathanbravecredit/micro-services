import { CreditReport } from 'libs/interfaces/credit-report.interface';
import { CreditReportChecker } from 'libs/utils/mailchimp/checkers/CreditReportChecker';
import { IMarketingCheckerResults } from 'libs/utils/mailchimp/interfaces';
import { CreditReportMetrics } from 'libs/utils/transunion/CreditReportMetrics';

export class MarketingCheckFive extends CreditReportChecker {
  constructor(event: 'MODIFY' | 'INSERT', current: CreditReport, prior: CreditReport | null) {
    super(event, current, prior);
  }

  check(): IMarketingCheckerResults {
    if (!this.currCreditReport) return this.generateResults(false);
    const current = new CreditReportMetrics(this.currCreditReport);
    current.aggregate();
    const negatives = current.metrics.countDerogatoryAccounts;
    const tags = negatives
      ? [this.generateTag('negative_account(s)', 'active'), this.generateTag('no_negative_account(s)', 'inactive')]
      : [this.generateTag('negative_account(s)', 'inactive'), this.generateTag('no_negative_account(s)', 'active')];
    return this.generateResults(true, tags);
  }
}
