import { UpdateAppDataInput } from 'lib/aws/api.service';
import { MarketingCheckZero } from 'lib/utils/mailchimp/checkers/checks/MarketingCheckZero';
import { MarketingCheckOne } from 'lib/utils/mailchimp/checkers/checks/MarketingCheckOne';
import { MailchimpTriggerEmails } from 'lib/utils/mailchimp/constants';
import { IMailchimpPacket, IMarketingCheckerResults, IMarketingData } from 'lib/utils/mailchimp/interfaces';

export class MailchimpAppDataMarketingTags {
  static currTriggers: IMailchimpPacket<IMarketingData>[];
  static triggerLibrary: Record<
    string,
    (prior: UpdateAppDataInput | null, curr: UpdateAppDataInput, event: 'INSERT' | 'MODIFY') => IMarketingCheckerResults
  > = {
    [MailchimpTriggerEmails.MarketingDefaults]: (p, c, e) => new MarketingCheckZero(e, c, p).check(),
    [MailchimpTriggerEmails.EnrollmentTag]: (p, c, e) => new MarketingCheckOne(e, c, p).check(),
  };

  constructor() {}

  // add different scenarios and a resolver
  static resolver(
    prior: UpdateAppDataInput | null,
    curr: UpdateAppDataInput,
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
