import { CreditReport } from 'lib/interfaces/credit-report.interface';
import { CreditReportChecker } from 'lib/utils/mailchimp/checkers/CreditReportChecker';
import { IMarketingCheckerResults } from 'lib/utils/mailchimp/interfaces';
import { CreditReportMetrics } from 'lib/utils/transunion/CreditReportMetrics';

export class MarketingCheckSix extends CreditReportChecker {
  constructor(event: 'MODIFY' | 'INSERT', current: CreditReport, prior: CreditReport | null) {
    super(event, current, prior);
  }

  check(): IMarketingCheckerResults {
    if (this.event !== 'MODIFY') return this.generateResults(false);
    if (!this.currCreditReport) return this.generateResults(false);
    const current = new CreditReportMetrics(this.currCreditReport);
    const studentloans = current.countStudenLoans();
    const tags = studentloans
      ? [this.generateTag('student_loan(s)', 'active'), this.generateTag('student_loan(s)', 'inactive')]
      : [this.generateTag('student_loan(s)', 'inactive'), this.generateTag('student_loan(s)', 'active')];
    return this.generateResults(true, tags);
  }
}
