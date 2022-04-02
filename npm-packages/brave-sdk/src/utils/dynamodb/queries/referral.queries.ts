import 'reflect-metadata';
import { DynamoStore } from '@shiftcoders/dynamo-easy';
import { Referral, CAMPAIGNACTIVE_GSI, ELIGIBLE_GSI, REFERRAL_CODE_GSI } from '../../../models/referral/referral';

export class ReferralQueries {
  static store = new DynamoStore(Referral);
  constructor() {}

  static async getReferral(id: string): Promise<Referral | null> {
    return this.store.get(id).exec();
  }

  static async listReferrals(): Promise<Referral[]> {
    return this.store.scan().execFetchAll();
  }

  static async createReferral(referral: Referral): Promise<void> {
    return this.store.put(referral).ifNotExists().exec();
  }

  static async updateReferral(referral: Referral): Promise<void> {
    return this.store.put(referral).exec();
  }

  static async updateEnrollment(pkey: string): Promise<Referral> {
    return this.store.update(pkey).updateAttribute('enrolled').set(true).returnValues('ALL_NEW').exec();
  }

  static async updatePaidOut(pkey: string, paidOut: number): Promise<void> {
    return this.store.update(pkey).updateAttribute('campaignActivePaid').set(paidOut).exec();
  }

  static async updateAddOn(pkey: string, addOn: number): Promise<void> {
    return this.store
      .update(pkey)
      .updateAttribute('campaignActiveAddOn')
      .set(addOn)
      .updateAttribute('totalAddOn')
      .incrementBy(addOn)
      .exec();
  }

  static async updateNextPaymentDate(pkey: string, paymentDate: string): Promise<void> {
    return this.store.update(pkey).updateAttribute('nextPaymentDate').set(paymentDate).exec();
  }

  static async suspendReferral(id: string): Promise<void> {
    return this.store.update(id).updateAttribute('suspended').set(true).exec();
  }

  static async getActiveCampaignReferrals(campaign: string): Promise<Referral[]> {
    return this.store.query().index(CAMPAIGNACTIVE_GSI).wherePartitionKey(campaign).execFetchAll();
  }

  static async getEligibileReferrals(): Promise<Referral[]> {
    return this.store.query().index(ELIGIBLE_GSI).wherePartitionKey(1).execFetchAll();
  }

  static async getReferralByCode(code: string | null): Promise<Referral | null> {
    if (!code) return Promise.resolve(null);
    return this.store.query().index(REFERRAL_CODE_GSI).wherePartitionKey(code).execSingle();
  }

  static async updateReferralEligibility(id: string, eligibility: 1 | 0): Promise<void> {
    return this.store.update(id).updateAttribute('eligible').set(eligibility).exec();
  }

  static async updateReferralCampaign(id: string, campaign: string): Promise<void> {
    const now = new Date().toISOString();
    return this.store
      .update(id)
      .updateAttribute('campaignActive')
      .set(campaign)
      .updateAttribute('modifiedOn')
      .set(now)
      .exec();
  }

  static async batchDeleteReferrals(records: Referral[]): Promise<any> {
    return this.store.batchWrite().delete(records).exec();
  }
}
