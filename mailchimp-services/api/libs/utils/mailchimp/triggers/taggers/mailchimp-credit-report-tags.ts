import { MarketingCheckTwo } from 'libs/utils/mailchimp/checkers/checks/MarketingCheckTwo';
import { MarketingCheckThree } from 'libs/utils/mailchimp/checkers/checks/MarketingCheckThree';
import { MarketingCheckFour } from 'libs/utils/mailchimp/checkers/checks/MarketingCheckFour';
import { MarketingCheckFive } from 'libs/utils/mailchimp/checkers/checks/MarketingCheckFive';
import { MarketingCheckSix } from 'libs/utils/mailchimp/checkers/checks/MarketingCheckSix';
import { MarketingCheckSeven } from 'libs/utils/mailchimp/checkers/checks/MarketingCheckSeven';
import { MarketingCheckEight } from 'libs/utils/mailchimp/checkers/checks/MarketingCheckEight';
import { MarketingCheckNine } from 'libs/utils/mailchimp/checkers/checks/MarketingCheckNine';
import { MarketingCheckTen } from 'libs/utils/mailchimp/checkers/checks/MarketingCheckTen';
import { MarketingCheckEleven } from 'libs/utils/mailchimp/checkers/checks/MarketingCheckEleven';
import { MarketingCheckTwelve } from 'libs/utils/mailchimp/checkers/checks/MarketingCheckTwelve';
import { MarketingCheckThirteen } from 'libs/utils/mailchimp/checkers/checks/MarketingCheckThirteen';
import { MailchimpTriggerEmails } from 'libs/utils/mailchimp/constants';
import { IMailchimpPacket, IMarketingCheckerResults, IMarketingData } from 'libs/utils/mailchimp/interfaces';
import { MarketingCheckFourteen } from 'libs/utils/mailchimp/checkers/checks/MarketingCheckFourteen';
import { CreditReport } from '@bravecredit/brave-sdk';

export class MailchimpCreditReportMarketingTags {
  static currTriggers: IMailchimpPacket<IMarketingData>[];
  static triggerLibrary: Record<
    string,
    (prior: CreditReport | null, curr: CreditReport, event: 'INSERT' | 'MODIFY') => IMarketingCheckerResults
  > = {
    [MailchimpTriggerEmails.MortgageTag]: (p, c, e) => new MarketingCheckTwo(e, c, p).check(),
    [MailchimpTriggerEmails.AutoLoanTag]: (p, c, e) => new MarketingCheckThree(e, c, p).check(),
    [MailchimpTriggerEmails.CollectionsTag]: (p, c, e) => new MarketingCheckFour(e, c, p).check(),
    [MailchimpTriggerEmails.NegativeTag]: (p, c, e) => new MarketingCheckFive(e, c, p).check(),
    [MailchimpTriggerEmails.StudentLoanTag]: (p, c, e) => new MarketingCheckSix(e, c, p).check(),
    [MailchimpTriggerEmails.ChangeAccounts]: (p, c, e) => new MarketingCheckSeven(e, c, p).check(),
    [MailchimpTriggerEmails.ChangeAddresses]: (p, c, e) => new MarketingCheckEight(e, c, p).check(),
    [MailchimpTriggerEmails.ChangeEmployers]: (p, c, e) => new MarketingCheckNine(e, c, p).check(),
    [MailchimpTriggerEmails.ChangeNames]: (p, c, e) => new MarketingCheckTen(e, c, p).check(),
    [MailchimpTriggerEmails.ChangeCollections]: (p, c, e) => new MarketingCheckEleven(e, c, p).check(),
    [MailchimpTriggerEmails.ChangeNegatives]: (p, c, e) => new MarketingCheckTwelve(e, c, p).check(),
    [MailchimpTriggerEmails.ChangeCreditScore]: (p, c, e) => new MarketingCheckThirteen(e, c, p).check(),
    [MailchimpTriggerEmails.Over650Score]: (p, c, e) => new MarketingCheckFourteen(e, c, p).check(),
  };

  constructor() {}

  // add different scenarios and a resolver
  static resolver(
    prior: CreditReport | null,
    curr: CreditReport,
    event: 'INSERT' | 'MODIFY',
  ): IMailchimpPacket<IMarketingData>[] {
    let triggers: IMailchimpPacket<IMarketingData>[] = [];
    for (let key in this.triggerLibrary) {
      if (this.triggerLibrary[key](prior, curr, event).valid) {
        const { data } = this.triggerLibrary[key](prior, curr, event);
        const packet = { template: key, data: data } as IMailchimpPacket<IMarketingData>;
        triggers = [...triggers, packet];
      }
    }
    this.currTriggers = triggers; // store for reference
    return triggers;
  }
}
