import { CreditReport } from 'lib/interfaces/credit-report.interface';
import { CreditReportChecker } from 'lib/utils/mailchimp/checkers/CreditReportChecker';
import { IMarketingCheckerResults } from 'lib/utils/mailchimp/interfaces';
import { CreditReportMetrics } from 'lib/utils/transunion/CreditReportMetrics';

export class MarketingCheckFourteen extends CreditReportChecker {
  constructor(event: 'MODIFY' | 'INSERT', current: CreditReport, prior: CreditReport | null) {
    super(event, current, prior);
  }

  check(): IMarketingCheckerResults {
    if (!this.currCreditReport) return this.generateResults(false);
    const current = new CreditReportMetrics(this.currCreditReport);
    const score = current.creditScore;
    console.log('score', score);
    console.log('currCreditReport', this.currCreditReport);
    const tags =
      (score || 0) > 650
        ? [this.generateTag('over_650', 'active'), this.generateTag('under_650', 'inactive')]
        : [this.generateTag('over_650', 'inactive'), this.generateTag('under_650', 'active')];
    return this.generateResults(true, tags);
  }
}
