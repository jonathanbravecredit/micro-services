import { CreditReport } from '@bravecredit/brave-sdk';
import { CreditReportChecker } from 'libs/utils/mailchimp/checkers/CreditReportChecker';
import { IMarketingCheckerResults } from 'libs/utils/mailchimp/interfaces';
import { CreditReportMetrics } from 'libs/utils/transunion/CreditReportMetrics';

export class MarketingCheckTwelve extends CreditReportChecker {
  constructor(event: 'MODIFY' | 'INSERT', current: CreditReport, prior: CreditReport | null) {
    super(event, current, prior);
  }

  check(): IMarketingCheckerResults {
    if (this.event !== 'MODIFY') return this.generateResults(false);
    if (!this.currCreditReport || !this.priorCreditReport) return this.generateResults(false);
    const current = new CreditReportMetrics(this.currCreditReport);
    const prior = new CreditReportMetrics(this.priorCreditReport);

    current.aggregate();
    prior.aggregate();
    if (current.metrics.countDerogatoryAccounts > prior.metrics.countDerogatoryAccounts) {
      const tags = [
        this.generateTag('added_negative_acct(s)', 'active'),
        this.generateTag('removed_negative_acct(s)', 'inactive'),
      ];
      return this.generateResults(true, tags);
    } else if (current.metrics.countDerogatoryAccounts > prior.metrics.countDerogatoryAccounts) {
      const tags = [
        this.generateTag('added_negative_acct(s)', 'inactive'),
        this.generateTag('removed_negative_acct(s)', 'active'),
      ];
      return this.generateResults(true, tags);
    } else {
      const tags = [
        this.generateTag('added_negative_acct(s)', 'inactive'),
        this.generateTag('removed_negative_acct(s)', 'inactive'),
      ];
      return this.generateResults(true, tags);
    }
  }
}
