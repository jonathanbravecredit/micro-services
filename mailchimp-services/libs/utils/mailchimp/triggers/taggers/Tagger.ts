import { MailchimpAppDataMarketingTags } from 'libs/utils/mailchimp/triggers/taggers/mailchimp-app-data-tags';
import { MailchimpCreditReportMarketingTags } from 'libs/utils/mailchimp/triggers/taggers/mailchimp-credit-report-tags';
import { MailchimpDisputeTags } from 'libs/utils/mailchimp/triggers/taggers/mailchimp-dispute-tags';
import { MailchimpNotificationTags } from 'libs/utils/mailchimp/triggers/taggers/mailchimp-notification-tags';
import { MailchimpReferralTags } from 'libs/utils/mailchimp/triggers/taggers/mailchimp-referrals-tags';

export class Tagger {
  static app = MailchimpAppDataMarketingTags;
  static dispute = MailchimpDisputeTags;
  static referral = MailchimpReferralTags;
  static creditReport = MailchimpCreditReportMarketingTags;
  static notification = MailchimpNotificationTags;
}
