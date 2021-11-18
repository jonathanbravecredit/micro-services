import { GlobalMergeVar, MailMessage, MailPayload, TemplateMailMessage } from './interfaces';
import { MailchimpTriggers } from 'lib/utils/mailchimp/triggers';
import { MailchimpDisputeTriggers } from 'lib/utils/mailchimp/triggers/mailchimp-dispute-triggers';
import { MailchimpScoreTriggers } from 'lib/utils/mailchimp/triggers/mailchimp-credit-report-triggers';

export class Mailchimp {
  static triggers = MailchimpTriggers;
  static disputeTriggers = MailchimpDisputeTriggers;
  static scoreTriggers = MailchimpScoreTriggers;
  constructor() {}

  static createSNSPayload(subject: string, message: MailMessage): AWS.SNS.PublishInput {
    return {
      Subject: subject,
      Message: JSON.stringify({
        service: 'mailchimp',
        command: 'POST',
        message: message,
      }),
      TopicArn: process.env.SNS_PROXY_ARN || '',
    };
  }

  static createMailMessage(email: string, trigger: string, globalMergeVars?: GlobalMergeVar[]): MailMessage {
    return {
      email,
      action: trigger,
      globalMergeVars,
    };
  }

  static createTemplateMessage(
    fromEmail: string,
    toEmail: string,
    globalMerge?: GlobalMergeVar[],
  ): TemplateMailMessage {
    return {
      from_email: fromEmail,
      to: [{ email: toEmail, type: 'to' }],
      global_merge_vars: globalMerge || [{ name: 'default', content: 'default' }],
    };
  }
}
