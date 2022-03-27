import { SNSEventRecord } from 'aws-lambda';
import { Campaign } from 'libs/models/campaigns/campaign.model';
import { Referral } from 'libs/models/referrals/referral.model';

export class ReferralActivationManager {
  campaign: Campaign | null = null;
  campaignDefault: Campaign | null = null;
  referral: Referral | null = null;
  constructor(public record: SNSEventRecord) {}
}
