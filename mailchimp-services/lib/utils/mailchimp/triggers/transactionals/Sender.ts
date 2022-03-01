import { MailchimpDisputeTriggers } from 'lib/utils/mailchimp/triggers/transactionals/mailchimp-dispute-triggers';
import { MailchimpReferralTriggers } from 'lib/utils/mailchimp/triggers/transactionals/mailchimp-referrals-triggers';
import { MailchimpTriggers } from 'lib/utils/mailchimp/triggers/transactionals/mailchimp-triggers';

export class Sender {
  static app = MailchimpTriggers;
  static dispute = MailchimpDisputeTriggers;
  static referral = MailchimpReferralTriggers;
}
