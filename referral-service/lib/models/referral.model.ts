import { Model, PartitionKey } from '@shiftcoders/dynamo-easy';

@Model({ tableName: 'Referrals' })
export class Referral {
  @PartitionKey()
  id!: string;
  referralCode: string | undefined;
  referredByCode: string | null | undefined;
  enrollmentStatus: 'pending' | 'enrolled' = 'pending';
  processingStatus: 'pending' | 'paid' = 'pending';
  paidOut: 'pending' | 'paid' = 'pending';
  sub: string | null | undefined;
  campaign: string | null | undefined;
  createdOn: string | undefined;
  modifiedOn: string | undefined;
  referralStatus: 'suspended' | 'active' | undefined;
}

export class ReferralMaker implements Referral {
  id: string;
  referralCode: string;
  referredByCode: string | null | undefined;
  enrollmentStatus: 'pending' | 'enrolled';
  processingStatus: 'pending' | 'paid';
  paidOut: 'pending' | 'paid';
  sub: string | null;
  campaign: string | null;
  createdOn: string | undefined;
  modifiedOn: string | undefined;
  referralStatus: 'suspended' | 'active' | undefined;

  constructor(id: string, referralCode: string, campaign: string, referredByCode?: string) {
    this.id = id;
    this.referralCode = referralCode;
    this.referredByCode = referredByCode;
    this.enrollmentStatus = 'pending';
    this.processingStatus = 'pending';
    this.paidOut = 'pending';
    this.sub = null;
    this.campaign = campaign;
    this.createdOn = new Date().toISOString();
    this.modifiedOn = new Date().toISOString();
    this.referralStatus = 'active';
  }

  updateReferralEnrollment(enrollment: 'pending' | 'enrolled') {
    this.enrollmentStatus = enrollment;
  }

  updateAccountStatus(status: 'suspended' | 'active') {
    this.referralStatus = status;
  }
}
