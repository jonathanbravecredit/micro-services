import { GSIPartitionKey, Model, PartitionKey } from '@shiftcoders/dynamo-easy';

export const REFERRAL_CODE_GSI = 'referralCode-index';

@Model({ tableName: 'Referrals' })
export class Referral {
  @PartitionKey()
  id!: string;
  @GSIPartitionKey(REFERRAL_CODE_GSI)
  referralCode!: string;
  referredByCode: string | null | undefined;
  enrollmentStatus: 'pending' | 'enrolled' = 'pending';

  enrollmentEarnings: number = 0;
  enrollmentEarningsStatus: 'pending' | 'paid' = 'pending';
  referralEarnings: number = 0;
  referralEarningsStatus: 'pending' | 'paid' = 'pending';
  bonusEarnings: number = 0;
  bonusEarningsStatus: 'pending' | 'paid' = 'pending';

  campaign: string | null | undefined;
  createdOn: string | undefined;
  modifiedOn: string | undefined;
  referralStatus: 'suspended' | 'active' | undefined;
  referralApproved: boolean | undefined;
}

export class ReferralMaker implements Referral {
  id: string;
  referralCode: string;
  referredByCode: string | null | undefined;
  enrollmentStatus: 'pending' | 'enrolled';

  enrollmentEarnings: number;
  enrollmentEarningsStatus: 'pending' | 'paid';
  referralEarnings: number;
  referralEarningsStatus: 'pending' | 'paid';
  bonusEarnings: number;
  bonusEarningsStatus: 'pending' | 'paid';

  campaign: string | null;
  createdOn: string | undefined;
  modifiedOn: string | undefined;
  referralStatus: 'suspended' | 'active' | undefined;
  referralApproved: boolean | undefined;

  constructor(id: string, referralCode: string, campaign: string, referralApproved: boolean, referredByCode?: string) {
    this.id = id;
    this.referralCode = referralCode;
    this.referredByCode = referredByCode;
    this.enrollmentStatus = 'pending';

    this.enrollmentEarnings = 0;
    this.enrollmentEarningsStatus = 'pending';
    this.referralEarnings = 0;
    this.referralEarningsStatus = 'pending';
    this.bonusEarnings = 0;
    this.bonusEarningsStatus = 'pending';

    this.campaign = campaign;
    this.createdOn = new Date().toISOString();
    this.modifiedOn = new Date().toISOString();
    this.referralStatus = 'active';
    this.referralApproved = referralApproved;
  }

  updateReferralEnrollment(enrollment: 'pending' | 'enrolled') {
    this.enrollmentStatus = enrollment;
  }

  updateAccountStatus(status: 'suspended' | 'active') {
    this.referralStatus = status;
  }
}
