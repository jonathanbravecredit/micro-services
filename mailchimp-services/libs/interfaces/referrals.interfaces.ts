export interface IReferrals {
  id: string;

  referralCode: string;

  referredByCode: string | null | undefined;
  referredById: string | undefined;
  referredByEmail: string | undefined;

  eligible: 0 | 1;
  enrolled: boolean;
  suspended: boolean;

  baseEarned: number;
  bonusEarned: number;
  addOnEarned: number;

  campaignActive: string;
  campaignActiveReferred: number;
  campaignActiveEarned: number;
  campaignActivePaid: number;
  campaignActiveAddOn: number;
  campaignActiveBonus: boolean;

  campaignPrior: string;
  campaignPriorReferred: number;
  campaignPriorEarned: number;
  campaignPriorPaid: number;
  campaignPriorAddOn: number;
  campaignPriorBonus: boolean;

  nextPaymentDate: string;
  notified: boolean;
  createdOn: string | undefined;
  modifiedOn: string | undefined;
}
