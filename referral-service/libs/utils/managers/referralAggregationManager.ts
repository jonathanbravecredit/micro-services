import { DynamoDBRecord } from 'aws-lambda';
import { Campaign } from 'libs/models/campaigns/campaign.model';
import { Referral } from 'libs/models/referrals/referral.model';
import { DBStreamRunner } from 'libs/utils/dynamodb/dbStreamRunner';
import dayjs from 'dayjs';
import { getReferralByCode, updateReferral } from 'libs/queries/referrals/referral.queries';
import { PaymentDateCalculator } from 'libs/utils/paymentdatecalculator/paymentDateCalculator';

export class ReferralAggregationManager extends DBStreamRunner<Referral> {
  enrollment: 'not_enrolled' | 'new_enrolled' | 'past_enrolled' | undefined;
  referrer: Referral | null = null;
  referree: Referral | null = null;
  constructor(public campaign: Campaign, public record: DynamoDBRecord) {
    super(record);
  }
  async init(): Promise<void> {
    console.log('aggregation record: ', JSON.stringify(this.record));
    super.init();
    this.setEnrollment();
    this.setReferree();
    await this.setReferrer();
    console.log('enrollment: ===> ', this.enrollment);
    console.log('referree: ===> ', this.referree);
    console.log('referrer: ===> ', this.referrer);
  }

  setReferree(): void {
    this.referree = this.currImage;
  }

  async setReferrer(): Promise<void> {
    this.referrer = (await this.getReferrer()) || null;
  }

  async getReferrer(): Promise<Referral | null> {
    if (!this.currImage) return null;
    const { referredByCode } = this.currImage;
    if (!referredByCode) return null;
    return await getReferralByCode(referredByCode);
  }

  /**
   * Processes INSERTS and MODIFYs
   * - inserts come in two forms:
   *   1) A user who just signs up (enrolled = false)
   *   2) A user who already signed up but did not have a referral record (enrolled = true)
   *   under condition 1, the user is considered past_enrolled
   *   under condition 2, the user is considered not_enrolled
   * - modifies
   *   monitor when the enrollment goes from enrolled = false > true
   * @returns
   */
  setEnrollment(): void {
    if (!this.priorImage) {
      this.enrollment = this.currImage?.enrolled ? 'past_enrolled' : 'not_enrolled';
      return;
    }
    const prior = this.priorImage?.enrolled || false;
    const curr = this.currImage?.enrolled || false;
    this.enrollment = curr ? (!prior ? 'new_enrolled' : 'past_enrolled') : 'not_enrolled';
  }

  /**
   * Qualifies the referral (new_enrolled & campaign active) and adds:
   * - count
   * - earning
   * - bonus
   * to the person who referred them, and:
   * - addOn bonus for enrolling, if enabled
   * Must be: new_enrolled
   * @returns void
   */
  async quantifyReferral(): Promise<void> {
    if (!this.isCampaignActive()) return;
    if (this.enrollment === 'new_enrolled') {
      console.log('quantifying');
      await this.creditReferrer();
      await this.creditReferree();
    }
  }

  isCampaignActive(): boolean {
    const { campaign, endDate } = this.campaign;
    if (campaign === 'NO_CAMPAIGN') return false;
    if (dayjs(new Date()).isAfter(endDate)) return false;
    return true;
  }

  async creditReferrer(): Promise<void> {
    if (!this.referrer || !Object.keys(this.referrer).length) return;
    let updated = { ...this.referrer };
    // keep in this order
    updated = { ...updated, ...this.incrementCount(updated) };
    updated = { ...updated, ...this.incrementBase(updated) };
    updated = { ...updated, ...this.incrementBonus(updated) };
    updated = { ...updated, ...this.getPaymentDate(updated) };
    console.log('creditReferrer:updated ===> ', updated);
    await this.updateReferral(updated);
  }

  async creditReferree(): Promise<void> {
    if (!this.referree || !Object.keys(this.referree).length) return;
    let updated = { ...this.referree };
    // keep in this order
    updated = { ...updated, ...this.incrementAddOn(updated) };
    updated = { ...updated, ...this.getPaymentDate(updated) };
    console.log('creditReferree:updated ===> ', updated);
    await this.updateReferral(updated);
  }

  async updateReferral(referral: Referral): Promise<void> {
    await updateReferral(referral);
  }

  getPaymentDate(referrer: Referral): { nextPaymentDate: string } {
    const bonusOrMax = this.hitMax(referrer);
    const nextPaymentDate = new PaymentDateCalculator().calcPaymentDate(bonusOrMax, this.campaign.endDate);
    return { nextPaymentDate };
  }

  hitMax(referrer: Referral): boolean {
    const { campaignActiveReferred: referred } = referrer;
    const { maxReferrals: max } = this.campaign;
    if (!referred) return false;
    const reachedMax = referred >= max && max > 0;
    return reachedMax;
  }

  incrementCount(referrer: Referral): { campaignActiveReferred: number; totalReferred: number } {
    const { maxReferrals } = this.campaign;
    let { campaignActiveReferred, totalReferred } = referrer;
    if (campaignActiveReferred >= maxReferrals) return { campaignActiveReferred, totalReferred };
    campaignActiveReferred += 1;
    totalReferred += 1;
    return { campaignActiveReferred, totalReferred };
  }

  incrementBase(referrer: Referral): { campaignActiveEarned: number; totalEarned: number } {
    const { denomination, maxReferrals } = this.campaign;
    let { campaignActiveReferred, campaignActiveEarned, totalEarned } = referrer;
    if (campaignActiveReferred >= maxReferrals) return { campaignActiveEarned, totalEarned };
    campaignActiveEarned += denomination;
    totalEarned += denomination;
    return { campaignActiveEarned, totalEarned };
  }

  incrementBonus(referrer: Referral): { campaignActiveBonus: number; totalBonus: number } {
    const { bonusThreshold, bonusAmount } = this.campaign;
    let { campaignActiveReferred, campaignActiveBonus, totalBonus } = referrer;
    if (campaignActiveBonus > 0) return { campaignActiveBonus, totalBonus };
    const reachedBonus = campaignActiveReferred === bonusThreshold;
    if (!reachedBonus) return { campaignActiveBonus, totalBonus };
    campaignActiveBonus += bonusAmount;
    totalBonus += bonusAmount;
    return { campaignActiveBonus, totalBonus };
  }

  incrementAddOn(referree: Referral): { campaignActiveAddOn: number; totalAddOn: number } {
    const { denomination, addOnFlagOne, addOnFlagTwo, addOnFlagThree } = this.campaign;
    let { campaignActiveAddOn, totalAddOn } = referree;
    // add on one
    if (!(addOnFlagOne === 'enrollment')) return { campaignActiveAddOn, totalAddOn };
    // need to add better logic here when multiple addons come on
    if (campaignActiveAddOn > 0) return { campaignActiveAddOn, totalAddOn }; // can only get it once
    campaignActiveAddOn += denomination;
    totalAddOn += denomination;
    // add on two - not in place yet
    // add on three - not in place yet
    return { campaignActiveAddOn, totalAddOn };
  }
}
