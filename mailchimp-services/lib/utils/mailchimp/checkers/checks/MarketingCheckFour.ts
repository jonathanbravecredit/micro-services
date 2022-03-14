import { CreditReport } from 'lib/interfaces/credit-report.interface';
import { CreditReportChecker } from 'lib/utils/mailchimp/checkers/CreditReportChecker';
import { IMarketingCheckerResults } from 'lib/utils/mailchimp/interfaces';
import { CreditReportMetrics } from 'lib/utils/transunion/CreditReportMetrics';

export class MarketingCheckFour extends CreditReportChecker {
  constructor(event: 'MODIFY' | 'INSERT', current: CreditReport, prior: CreditReport | null) {
    super(event, current, prior);
  }

  check(): IMarketingCheckerResults {
    if (!this.currCreditReport) return this.generateResults(false);
    const current = new CreditReportMetrics(this.currCreditReport);
    const collections = current.countCollectionAccounts();
    const tags = collections
      ? [this.generateTag('collections(s)', 'active'), this.generateTag('collections(s)', 'inactive')]
      : [this.generateTag('collections(s)', 'inactive'), this.generateTag('collections(s)', 'active')];
    return this.generateResults(true, tags);
  }
}
