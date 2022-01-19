import { GSIPartitionKey, Model, PartitionKey } from '@shiftcoders/dynamo-easy';

export const REFERRAL_CODE_GSI = 'referralCode-index';

@Model({ tableName: 'ReferralUsers' })
export class ReferralUser {
  @PartitionKey()
  id!: string;
  referralCode!: string;
  referralStatus: string = 'active';
  baseEarned: number = 0;
  basePending: number = 0;
  basePaymentScheduledOn: string = '';
  bonusEarned: number = 0;
  bonusPending: number = 0;
  bonusPaymentScheduledOn: string = '';
  campaignActive: string = '';
  campaignActiveStatus: 'inactive' | 'active' = 'inactive';
  campaignActiveReferred: number = 0;
  campaignActiveEarned: number = 0;
  createdOn: string | undefined;
  modifiedOn: string | undefined;
}

export class ReferralUserMaker implements ReferralUser {
  id: string;
  referralCode: string;
  referralStatus: 'active' | 'suspended' = 'active';
  // base earnings for referrals
  baseEarned: number = 0;
  basePending: number = 0;
  basePaymentScheduledOn: string = '';
  // bonus earnings for add ons
  bonusEarned: number = 0;
  bonusPending: number = 0;
  bonusPaymentScheduledOn: string = '';
  // campaign tracking data
  campaignActive: string = 'NO_CAMPAIGN';
  campaignActiveStatus: 'inactive' | 'active' = 'inactive';
  campaignActiveReferred: number = 0;
  campaignActiveEarned: number = 0;

  createdOn: string | undefined;
  modifiedOn: string | undefined;

  constructor(id: string, referralCode: string) {
    this.id = id;
    this.referralCode = referralCode;
    this.createdOn = new Date().toISOString();
    this.modifiedOn = new Date().toISOString();
  }

  updateCampaignStatus(status: 'inactive' | 'active') {
    this.campaignActiveStatus = status;
  }
}
