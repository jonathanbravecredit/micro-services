import { CreditReport } from '@bravecredit/brave-sdk';
import { CreditReportChecker } from 'libs/utils/mailchimp/checkers/CreditReportChecker';
import { IMarketingCheckerResults } from 'libs/utils/mailchimp/interfaces';
import { CreditReportMetrics } from 'libs/utils/transunion/CreditReportMetrics';

export class MarketingCheckEight extends CreditReportChecker {
  constructor(event: 'INSERT' | 'MODIFY', current: CreditReport, prior: CreditReport | null) {
    super(event, current, prior);
  }

  check(): IMarketingCheckerResults {
    if (this.event !== 'MODIFY') return this.generateResults(false);
    if (!this.currCreditReport || !this.priorCreditReport) return this.generateResults(false);
    const current = new CreditReportMetrics(this.currCreditReport);
    const prior = new CreditReportMetrics(this.priorCreditReport);

    if (current.totalAddresses > prior.totalAddresses) {
      const tags = [
        this.generateTag('added_address(es)', 'active'),
        this.generateTag('removed_address(es)', 'inactive'),
      ];
      return this.generateResults(true, tags);
    } else if (current.totalAddresses < prior.totalAddresses) {
      const tags = [
        this.generateTag('added_address(es)', 'inactive'),
        this.generateTag('removed_address(es)', 'active'),
      ];
      return this.generateResults(true, tags);
    } else {
      const tags = [
        this.generateTag('added_address(es)', 'inactive'),
        this.generateTag('removed_address(es)', 'inactive'),
      ];
      return this.generateResults(true, tags);
    }
  }
}
