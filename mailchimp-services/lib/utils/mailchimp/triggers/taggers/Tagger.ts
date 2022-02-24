import { MailchimpAppDataMarketingTags } from 'lib/utils/mailchimp/triggers/taggers/mailchimp-app-data-tags';
import { MailchimpCreditReportMarketingTags } from 'lib/utils/mailchimp/triggers/taggers/mailchimp-credit-report-tags';
import { MailchimpCreditScoreTags } from 'lib/utils/mailchimp/triggers/taggers/mailchimp-credit-score-tags';
import { MailchimpDisputeTags } from 'lib/utils/mailchimp/triggers/taggers/mailchimp-dispute-tags';
import { MailchimpNotificationTags } from 'lib/utils/mailchimp/triggers/taggers/mailchimp-notification-tags';
import { MailchimpReferralTags } from 'lib/utils/mailchimp/triggers/taggers/mailchimp-referrals-tags';

export class Tagger {
  static app = MailchimpAppDataMarketingTags;
  static dispute = MailchimpDisputeTags;
  static referral = MailchimpReferralTags;
  static creditScore = MailchimpCreditScoreTags;
  static creditReport = MailchimpCreditReportMarketingTags;
  static notification = MailchimpNotificationTags;
}
