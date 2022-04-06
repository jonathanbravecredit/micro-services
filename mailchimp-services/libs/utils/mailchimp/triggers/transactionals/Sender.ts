import { MailchimpCreditReportTriggers } from 'libs/utils/mailchimp/triggers/transactionals/mailchimp-credit-report-triggers';
import { MailchimpDisputeTriggers } from 'libs/utils/mailchimp/triggers/transactionals/mailchimp-dispute-triggers';
import { MailchimpReferralTriggers } from 'libs/utils/mailchimp/triggers/transactionals/mailchimp-referrals-triggers';
import { MailchimpTriggers } from 'libs/utils/mailchimp/triggers/transactionals/mailchimp-triggers';

export class Sender {
  static app = MailchimpTriggers;
  static dispute = MailchimpDisputeTriggers;
  static referral = MailchimpReferralTriggers;
  static report = MailchimpCreditReportTriggers;
}
