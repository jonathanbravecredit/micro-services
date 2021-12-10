import { Model, PartitionKey } from '@shiftcoders/dynamo-easy';

@Model({ tableName: 'Referrals' })
export class Referral {
  @PartitionKey()
  id!: string;
  referralCode: string | undefined;
  referredByCode: string | null | undefined;
  enrollmentStatus: 'pending' | 'enrolled' = 'pending';
  processingStatus: 'pending' | 'paid' = 'pending';
  sub: string | null | undefined;
  campaign: string | null | undefined;
  createdOn: string | undefined;
  modifiedOn: string | undefined;
}

export class ReferralMaker implements Referral {
  id: string;
  referralCode: string;
  referredByCode: string | null | undefined;
  enrollmentStatus: 'pending' | 'enrolled';
  processingStatus: 'pending' | 'paid';
  sub: string | null;
  campaign: string | null;
  createdOn: string | undefined;
  modifiedOn: string | undefined;

  constructor(id: string, referralCode: string, campaign: string, referredByCode?: string) {
    this.id = id;
    this.referralCode = referralCode;
    this.referredByCode = referredByCode;
    this.enrollmentStatus = 'pending';
    this.processingStatus = 'pending';
    this.sub = null;
    this.campaign = campaign;
    this.createdOn = new Date().toISOString();
    this.modifiedOn = new Date().toISOString();
  }
}
