import { CreditReport, IMergeReport } from '@bravecredit/brave-sdk';
import { MailchimpMarketingChecker } from 'libs/utils/mailchimp/checkers/MailchimpMarketingChecker';
import { ICreditReportChecker } from 'libs/utils/mailchimp/interfaces';

export class CreditReportChecker extends MailchimpMarketingChecker<CreditReport> implements ICreditReportChecker {
  public id: string | undefined;
  public currCreditReport: CreditReport | null | undefined;
  public priorCreditReport: CreditReport | null | undefined;
  public priorMergeReport: IMergeReport | null | undefined;
  public currMergeReport: IMergeReport | null | undefined;

  constructor(public event: 'MODIFY' | 'INSERT', curr: CreditReport, prior: CreditReport | null) {
    super(event, curr, prior);
    this.setId(curr.userId);
    this.priorCreditReport = prior;
    this.currCreditReport = curr;
    this.priorMergeReport = prior?.report;
    this.currMergeReport = curr.report;
  }
}
