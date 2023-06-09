const mailchimpMrkt = require('@mailchimp/mailchimp_marketing');
import { GlobalMergeVar, IMarketingTag, MailMessage, TemplateMailMessage } from './interfaces';
import { ProxyRequest } from 'libs/interfaces';
import { IMailChimp, IMailchimpBatchPayload, IMailchimpBatchResponse } from 'libs/interfaces/mailchimp.interfaces';
import md5 from 'md5';
import { Tagger } from 'libs/utils/mailchimp/triggers/taggers/Tagger';
import { Sender } from 'libs/utils/mailchimp/triggers/transactionals/Sender';

export class Mailchimp {
  static marketingListId: string = '1f041d6e21';
  static marketing = Tagger;
  static transactional = Sender;

  constructor() {}

  static createSNSPayload(subject: string, message: MailMessage, service: string = 'mailchimp'): AWS.SNS.PublishInput {
    return {
      Subject: subject,
      Message: JSON.stringify({
        service: service,
        command: 'POST',
        message: message,
      }),
      TopicArn: process.env.MAILCHIMP_DEQUEUE_SNS_ARN || '',
    };
  }

  static createMailMessage(
    email: string,
    action: string,
    globalMergeVars?: GlobalMergeVar[] | null,
    tag?: IMarketingTag[],
  ): MailMessage {
    return {
      email,
      action,
      globalMergeVars,
      tag,
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

  static async processTransactionalMessages(
    req: ProxyRequest,
    chimp: IMailChimp,
    bcEmail: string = 'support@brave.credit',
  ): Promise<void> {
    const {
      message: { email: email, action: action, globalMergeVars: globalMergeVars },
    } = req;
    const mailMessage = this.createTemplateMessage(bcEmail, email, globalMergeVars);
    console.log('mail message ==> ', mailMessage);
    const sendTemplate = {
      template_name: action,
      template_content: [{}],
      message: mailMessage,
    };
    console.log('sendTemplate ==> ', sendTemplate);
    const resp = await chimp.messages.sendTemplate(sendTemplate);
    console.log('mailchimp resp ==> ', resp);
  }

  static async processMarketingMessages(req: ProxyRequest, config: { apiKey: string; server: string }): Promise<void> {
    mailchimpMrkt.setConfig(config);
    if (req.message.action === 'add_new_user') {
      // need to build these out with a dictionary
      const {
        message: { email },
      } = req;
      if (!email || typeof email !== 'string') return;
      const hash = md5(email?.toLowerCase());
      const resp = await mailchimpMrkt.lists.setListMember(this.marketingListId, hash, {
        email_address: req.message.email,
        status_if_new: 'subscribed',
      });
      console.log('marketing resp ===> ', resp);
    }

    if (req.message.action === 'tag_user' && req.message.tag) {
      // need to build these out with a dictionary
      const {
        message: { tag, email },
      } = req;
      if (!tag || !email || typeof email !== 'string') return;
      const hash = md5(email?.toLowerCase());
      const resp = await mailchimpMrkt.lists.updateListMemberTags(this.marketingListId, hash, {
        tags: tag,
      });
      console.log('tag update ===> ', resp); // should be null
    }
  }

  static createBatchPayload(reqs: MailMessage[]): IMailchimpBatchPayload[] {
    const operation_id = `Batch-${new Date().toISOString()}`;
    const payload: IMailchimpBatchPayload[] = reqs
      .map((req) => {
        const { tag, email } = req;
        if (!tag || !email || typeof email !== 'string') return false;
        const hash = md5(email?.toLowerCase());
        return {
          method: 'POST',
          path: `/lists/${this.marketingListId}/members/${hash}/tags`,
          opertation_id: operation_id,
          body: JSON.stringify({ tags: tag }),
        };
      })
      .filter(Boolean) as IMailchimpBatchPayload[];
    return payload;
  }

  static async processBatchPayload(
    payloads: IMailchimpBatchPayload[],
    config: { apiKey: string; server: string },
  ): Promise<IMailchimpBatchResponse | void> {
    mailchimpMrkt.setConfig(config);
    const operations = { operations: payloads };
    try {
      // console.log('mailchimp operations: ', operations); // turning off for testing
      const resp = await mailchimpMrkt.batches.start(operations);
      return resp;
    } catch (err) {
      console.error('error ===> ', err);
    }
  }
}
