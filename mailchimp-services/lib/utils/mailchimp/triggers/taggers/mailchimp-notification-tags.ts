import { MarketingCheckSeven } from 'lib/utils/mailchimp/checkers/checks/MarketingCheckSeven';
import { MarketingCheckEight } from 'lib/utils/mailchimp/checkers/checks/MarketingCheckEight';
import { MarketingCheckNine } from 'lib/utils/mailchimp/checkers/checks/MarketingCheckNine';
import { MarketingCheckTen } from 'lib/utils/mailchimp/checkers/checks/MarketingCheckTen';
import { MarketingCheckEleven } from 'lib/utils/mailchimp/checkers/checks/MarketingCheckEleven';
import { MarketingCheckTwelve } from 'lib/utils/mailchimp/checkers/checks/MarketingCheckTwelve';
import { MarketingCheckThirteen } from 'lib/utils/mailchimp/checkers/checks/MarketingCheckThirteen';
import { MailchimpTriggerEmails } from 'lib/utils/mailchimp/constants';
import { IMailchimpPacket, IMarketingData, IMarketingCheckerResults } from 'lib/utils/mailchimp/interfaces';
import { CreditReport } from 'lib/interfaces/credit-report.interface';

export class MailchimpNotificationTags {
  static currTriggers: IMailchimpPacket<IMarketingData>[];
  static triggerLibrary: Record<
    string,
    (oldImage: CreditReport | null, newImage: CreditReport, event: 'INSERT' | 'MODIFY') => IMarketingCheckerResults
  > = {
    [MailchimpTriggerEmails.ChangeAccounts]: (p, c, e) => new MarketingCheckSeven(e, c, p).check(),
    [MailchimpTriggerEmails.ChangeAddresses]: (p, c, e) => new MarketingCheckEight(e, c, p).check(),
    [MailchimpTriggerEmails.ChangeEmployers]: (p, c, e) => new MarketingCheckNine(e, c, p).check(),
    [MailchimpTriggerEmails.ChangeNames]: (p, c, e) => new MarketingCheckTen(e, c, p).check(),
    [MailchimpTriggerEmails.ChangeCollections]: (p, c, e) => new MarketingCheckEleven(e, c, p).check(),
    [MailchimpTriggerEmails.ChangeNegatives]: (p, c, e) => new MarketingCheckTwelve(e, c, p).check(),
    [MailchimpTriggerEmails.ChangeCreditScore]: (p, c, e) => new MarketingCheckThirteen(e, c, p).check(),
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
