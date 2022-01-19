import { GSIPartitionKey, Model, PartitionKey } from '@shiftcoders/dynamo-easy';

export const REFERRAL_CODE_GSI = 'referralCode-index';
export const CAMPAIGNACTIVE_GSI = 'campaignActive-index';
export const ELIGIBLE_GSI = 'eligible-index';

@Model({ tableName: 'Referrals' })
export class Referral {
  @PartitionKey()
  id!: string;
  @GSIPartitionKey(REFERRAL_CODE_GSI)
  referralCode!: string;

  referredByCode: string | null | undefined;
  referredById: string | undefined;
  referredByEmail: string | undefined;

  @GSIPartitionKey(ELIGIBLE_GSI)
  eligible: 0 | 1 = 0;

  baseEarned: number = 0;
  bonusEarned: number = 0;
  addOnEarned: number = 0;

  @GSIPartitionKey(CAMPAIGNACTIVE_GSI)
  campaignActive: string = '';
  campaignActiveReferred: number = 0;
  campaignActiveEarned: number = 0;
  campaignActivePaid: number = 0;
  campaignActiveAddOn: number = 0;

  campaignPrior: string = '';
  campaignPriorReferred: number = 0;
  campaignPriorEarned: number = 0;
  campaignPriorPaid: number = 0;
  campaignPriorAddOn: number = 0;

  nextPaymentDate: string = '';
  notified: boolean = false;
  createdOn: string | undefined;
  modifiedOn: string | undefined;
}

export class ReferralMaker implements Referral {
  id: string;

  referralCode: string;
  referredByCode: string | null | undefined;
  referredById: string | undefined;
  referredByEmail: string | undefined;

  eligible: 0 | 1 = 0;

  baseEarned: number = 0;
  bonusEarned: number = 0;
  addOnEarned: number = 0;

  campaignActive: string = '';
  campaignActiveReferred: number = 0;
  campaignActiveEarned: number = 0;
  campaignActivePaid: number = 0;
  campaignActiveAddOn: number = 0;

  campaignPrior: string = '';
  campaignPriorReferred: number = 0;
  campaignPriorEarned: number = 0;
  campaignPriorPaid: number = 0;
  campaignPriorAddOn: number = 0;

  nextPaymentDate: string = '';
  notified: boolean = false;
  createdOn: string | undefined;
  modifiedOn: string | undefined;

  constructor(id: string, referralCode: string, referredByCode: string, referredById: string) {
    this.id = id;
    this.referralCode = referralCode;
    this.referredByCode = referredByCode;
    this.referredById = referredById;
    this.createdOn = new Date().toISOString();
    this.modifiedOn = new Date().toISOString();
  }

  getReferredById() {
    // add in logic here to look up the referred by code
  }
}
