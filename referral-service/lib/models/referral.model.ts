import { GSIPartitionKey, Model, PartitionKey } from '@shiftcoders/dynamo-easy';

export const REFERRAL_CODE_GSI = 'referralCode-index';

@Model({ tableName: 'Referrals' })
export class Referral {
  @PartitionKey()
  id!: string;
  @GSIPartitionKey(REFERRAL_CODE_GSI)
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

  referredByCode: string | null | undefined;
  referredById: string | undefined;
  referredByEmail: string | undefined;

  createdOn: string | undefined;
  modifiedOn: string | undefined;
}

export class ReferralMaker implements Referral {
  id: string;
  referralCode: string;
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

  referredByCode: string | null | undefined;
  referredById: string | undefined;
  referredByEmail: string | undefined;

  campaign: string | null | undefined;
  createdOn: string | undefined;
  modifiedOn: string | undefined;

  constructor(
    id: string,
    campaign: string,
    referralCode: string,
    referredByCode: string,
    referredById: string,
    referredByEmail: string,
  ) {
    this.id = id;
    this.campaign = campaign;
    this.referralCode = referralCode;
    this.referredByCode = referredByCode;
    this.referredById = referredById;
    this.referredByEmail = referredByEmail;
    this.createdOn = new Date().toISOString();
    this.modifiedOn = new Date().toISOString();
  }
}
