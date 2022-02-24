import { CreditReport } from 'lib/interfaces/credit-report.interface';
import { CreditReportChecker } from 'lib/utils/mailchimp/checkers/CreditReportChecker';
import { IMarketingCheckerResults } from 'lib/utils/mailchimp/interfaces';
import { CreditReportMetrics } from 'lib/utils/transunion/CreditReportMetrics';

export class MarketingCheckThirteen extends CreditReportChecker {
  constructor(event: 'MODIFY' | 'INSERT', current: CreditReport, prior: CreditReport | null) {
    super(event, current, prior);
  }

  check(): IMarketingCheckerResults {
    if (this.event !== 'MODIFY') return this.generateResults(false);
    if (!this.currCreditReport || !this.priorCreditReport) return this.generateResults(false);
    const current = new CreditReportMetrics(this.currCreditReport);
    const prior = new CreditReportMetrics(this.priorCreditReport);

    if (!current.creditScore || !prior.creditScore) return this.generateResults(false);
    if (current.creditScore > prior.creditScore) {
      const tags = [
        this.generateTag('credit_score_increase', 'active'),
        this.generateTag('credit_score_decrease', 'inactive'),
      ];
      return this.generateResults(true, tags);
    } else if (current.creditScore < prior.creditScore) {
      const tags = [
        this.generateTag('credit_score_increase', 'inactive'),
        this.generateTag('credit_score_decrease', 'active'),
      ];
      return this.generateResults(true, tags);
    } else {
      const tags = [
        this.generateTag('credit_score_increase', 'inactive'),
        this.generateTag('credit_score_decrease', 'inactive'),
      ];
      return this.generateResults(true, tags);
    }
  }
}
