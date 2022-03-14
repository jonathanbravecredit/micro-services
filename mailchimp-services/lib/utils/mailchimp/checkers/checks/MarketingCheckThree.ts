import { CreditReport } from 'lib/interfaces/credit-report.interface';
import { CreditReportChecker } from 'lib/utils/mailchimp/checkers/CreditReportChecker';
import { IMarketingCheckerResults } from 'lib/utils/mailchimp/interfaces';
import { CreditReportMetrics } from 'lib/utils/transunion/CreditReportMetrics';

export class MarketingCheckThree extends CreditReportChecker {
  constructor(event: 'MODIFY' | 'INSERT', current: CreditReport, prior: CreditReport | null) {
    super(event, current, prior);
  }

  check(): IMarketingCheckerResults {
    if (!this.currCreditReport) return this.generateResults(false);

    const current = new CreditReportMetrics(this.currCreditReport);
    const autoloans = current.countAutoLoan();
    const tags = autoloans
      ? [this.generateTag('auto_loan(s)', 'active'), this.generateTag('no_auto_loan(s)', 'inactive')]
      : [this.generateTag('auto_loan(s)', 'inactive'), this.generateTag('no_auto_loan(s)', 'active')];
    return this.generateResults(true, tags);
  }
}
