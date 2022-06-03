import { CreditReport } from '@bravecredit/brave-sdk';
import { CreditReportChecker } from 'libs/utils/mailchimp/checkers/CreditReportChecker';
import { IMarketingCheckerResults } from 'libs/utils/mailchimp/interfaces';
import { CreditReportMetrics } from 'libs/utils/transunion/CreditReportMetrics';

export class MarketingCheckTwo extends CreditReportChecker {
  constructor(event: 'MODIFY' | 'INSERT', current: CreditReport, prior: CreditReport | null) {
    super(event, current, prior);
  }

  check(): IMarketingCheckerResults {
    if (!this.currCreditReport) return this.generateResults(false);
    const current = new CreditReportMetrics(this.currCreditReport);
    const mortgages = current.countMortgages();
    const tags = mortgages
      ? [this.generateTag('mortgage(s)', 'active'), this.generateTag('no_mortgage(s)', 'inactive')]
      : [this.generateTag('mortgage(s)', 'inactive'), this.generateTag('no_mortgage(s)', 'active')];
    return this.generateResults(true, tags);
  }
}
