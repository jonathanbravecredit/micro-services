import { CreditReport } from 'lib/interfaces/credit-report.interface';
import { CreditReportChecker } from 'lib/utils/mailchimp/checkers/CreditReportChecker';
import { IMarketingCheckerResults } from 'lib/utils/mailchimp/interfaces';
import { CreditReportMetrics } from 'lib/utils/transunion/CreditReportMetrics';

export class MarketingCheckTwo extends CreditReportChecker {
  constructor(event: 'MODIFY' | 'INSERT', current: CreditReport, prior: CreditReport | null) {
    super(event, current, prior);
  }

  check(): IMarketingCheckerResults {
    if (this.event !== 'MODIFY') return this.generateResults(false);
    if (!this.currCreditReport) return this.generateResults(false);
    const current = new CreditReportMetrics(this.currCreditReport);
    const mortgages = current.countMortgages();
    const tags = mortgages
      ? [this.generateTag('mortgage(s)', 'active'), this.generateTag('no_mortgage(s)', 'inactive')]
      : [this.generateTag('mortgage(s)', 'inactive'), this.generateTag('no_mortgage(s)', 'active')];
    return this.generateResults(true, tags);
  }
}
