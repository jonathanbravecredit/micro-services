import { IDispute } from 'libs/interfaces';
import { MailchimpTriggerEmails } from 'libs/utils/mailchimp/constants';
import { IMailchimpPacket, ITransactionalData } from 'libs/utils/mailchimp/interfaces';

export class MailchimpDisputeTriggers {
  static currTriggers: IMailchimpPacket<ITransactionalData>[];
  constructor() {}

  // add different scenarios and a resolver
  static resolver(
    oldImage: IDispute | null,
    newImage: IDispute,
    event: 'INSERT' | 'MODIFY',
  ): IMailchimpPacket<ITransactionalData>[] {
    let triggers: IMailchimpPacket<ITransactionalData>[] = [];
    for (let key in triggerLibrary) {
      const { data, test } = triggerLibrary[key](oldImage, newImage, event);
      triggers = test ? (triggers = [...triggers, { template: key, data: data }]) : triggers;
    }
    this.currTriggers = triggers; // store for reference
    return triggers;
  }
}

// No dispute emails currently going through mailchimp (even informational ones)
const triggerLibrary: Record<
  string,
  (
    oldImage: IDispute | null,
    newImage: IDispute,
    event: 'INSERT' | 'MODIFY',
  ) => { test: boolean; data?: ITransactionalData }
> = {
  // [MailchimpTriggerEmails.DisputeSubmitted]: checkTwo,
  // [MailchimpTriggerEmails.DisputeResultsReady]: checkThreeFour,
};
