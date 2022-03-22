import { DynamoDBRecord } from 'aws-lambda';
import { SNS } from 'aws-sdk';
import { UserInitiative } from 'libs/models/UserInitiative.model';
import { MarketingCheckOne } from 'libs/utils/mailchimp/checkers/checks/MarketingCheckOne';
import { MarketingCheckZero } from 'libs/utils/mailchimp/checkers/checks/MarketingCheckZero';
import { MailchimpTriggerEmails } from 'libs/utils/mailchimp/constants';
import { IMailchimpPacket, IMarketingCheckerResults, IMarketingData } from 'libs/utils/mailchimp/interfaces';
import { DBStreamRunner } from 'libs/utils/runners/base/dbStreamRunner';

export class TriggerInitiativeProgramTagsRunner extends DBStreamRunner<UserInitiative> {
  triggers: IMailchimpPacket<IMarketingData>[] = [];
  triggerLibrary: Record<
    string,
    (prior: UserInitiative | null, curr: UserInitiative, event: 'INSERT' | 'MODIFY') => IMarketingCheckerResults
  > = {
    [MailchimpTriggerEmails.MarketingDefaults]: (p, c, e) => new MarketingCheckZero(e, c, p).check(),
    [MailchimpTriggerEmails.EnrollmentTag]: (p, c, e) => new MarketingCheckOne(e, c, p).check(),
  };

  constructor(public record: DynamoDBRecord, public sns: SNS) {
    super(record);
  }

  resolve(priorImage: UserInitiative | null, currImage: UserInitiative, event: 'MODIFY' | 'INSERT'): void {
    this.triggers = this.resolver(priorImage, currImage, event);
  }

  // add different scenarios and a resolver
  resolver(
    prior: UserInitiative | null,
    curr: UserInitiative,
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
    this.triggers = triggers; // store for reference
    return triggers;
  }

  async publish(): Promise<void> {}
}
