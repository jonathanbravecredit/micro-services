import { CreditReport } from 'libs/interfaces/credit-report.interface';
import { CreditReportChecker } from 'libs/utils/mailchimp/checkers/CreditReportChecker';
import { IMarketingCheckerResults } from 'libs/utils/mailchimp/interfaces';
import { CreditReportMetrics } from 'libs/utils/transunion/CreditReportMetrics';

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
