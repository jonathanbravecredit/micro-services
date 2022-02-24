import { CreditReport } from 'lib/interfaces/credit-report.interface';
import { CreditReportChecker } from 'lib/utils/mailchimp/checkers/CreditReportChecker';
import { IMarketingCheckerResults } from 'lib/utils/mailchimp/interfaces';
import { CreditReportMetrics } from 'lib/utils/transunion/CreditReportMetrics';

export class MarketingCheckTen extends CreditReportChecker {
  constructor(event: 'MODIFY' | 'INSERT', current: CreditReport, prior: CreditReport | null) {
    super(event, current, prior);
  }

  check(): IMarketingCheckerResults {
    if (this.event !== 'MODIFY') return this.generateResults(false);
    if (!this.currCreditReport || !this.priorCreditReport) return this.generateResults(false);
    const current = new CreditReportMetrics(this.currCreditReport);
    const prior = new CreditReportMetrics(this.priorCreditReport);

    if (current.totalNames > prior.totalNames) {
      const tags = [this.generateTag('added_names(s)', 'active'), this.generateTag('removed_names(s)', 'inactive')];
      return this.generateResults(true, tags);
    } else if (current.totalNames < prior.totalNames) {
      const tags = [this.generateTag('added_names(s)', 'inactive'), this.generateTag('removed_names(s)', 'active')];
      return this.generateResults(true, tags);
    } else {
      const tags = [this.generateTag('added_names(s)', 'inactive'), this.generateTag('removed_names(s)', 'inactive')];
      return this.generateResults(true, tags);
    }
  }
}
