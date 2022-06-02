import { CreditReport } from '@bravecredit/brave-sdk';
import { CreditReportChecker } from 'libs/utils/mailchimp/checkers/CreditReportChecker';
import { IMarketingCheckerResults } from 'libs/utils/mailchimp/interfaces';
import { CreditReportMetrics } from 'libs/utils/transunion/CreditReportMetrics';

export class MarketingCheckFour extends CreditReportChecker {
  constructor(event: 'MODIFY' | 'INSERT', current: CreditReport, prior: CreditReport | null) {
    super(event, current, prior);
  }

  check(): IMarketingCheckerResults {
    if (!this.currCreditReport) return this.generateResults(false);
    const current = new CreditReportMetrics(this.currCreditReport);
    const collections = current.countCollectionAccounts();
    const tags = collections
      ? [this.generateTag('collections(s)', 'active'), this.generateTag('no_collections(s)', 'inactive')]
      : [this.generateTag('collections(s)', 'inactive'), this.generateTag('no_collections(s)', 'active')];
    return this.generateResults(true, tags);
  }
}
