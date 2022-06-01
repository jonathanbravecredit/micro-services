import { CreditReport } from 'libs/interfaces/credit-report.interface';
import { CreditReportChecker } from 'libs/utils/mailchimp/checkers/CreditReportChecker';
import { IMarketingCheckerResults } from 'libs/utils/mailchimp/interfaces';
import { CreditReportMetrics } from 'libs/utils/transunion/CreditReportMetrics';

export class MarketingCheckFourteen extends CreditReportChecker {
  constructor(event: 'MODIFY' | 'INSERT', current: CreditReport, prior: CreditReport | null) {
    super(event, current, prior);
  }

  check(): IMarketingCheckerResults {
    if (!this.currCreditReport) return this.generateResults(false);
    const current = new CreditReportMetrics(this.currCreditReport);
    const score = current.creditScore;
    const tags =
      (score || 0) > 650
        ? [this.generateTag('over_650', 'active'), this.generateTag('under_650', 'inactive')]
        : [this.generateTag('over_650', 'inactive'), this.generateTag('under_650', 'active')];
    return this.generateResults(true, tags);
  }
}
