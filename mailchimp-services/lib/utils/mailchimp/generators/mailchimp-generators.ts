import { GlobalMergeVar, MailMessage } from 'lib/utils/mailchimp/interfaces';
import { MailchimpBase } from 'lib/utils/mailchimp/mailchimp-base';

export class MailchimpGenerators extends MailchimpBase {
  constructor() {
    super();
  }

  static createMailMessage(email: string, action: string, globalMergeVars?: GlobalMergeVar[]): MailMessage {
    return {
      email,
      action,
      globalMergeVars,
    };
  }
}
