import { DynamoDBRecord } from 'aws-lambda';
import { Campaign } from 'libs/models/campaigns/campaign.model';
import { Referral } from 'libs/models/referrals/referral.model';
import { DBStreamRunner } from 'libs/utils/dynamodb/dbStreamRunner';
import dayjs from 'dayjs';
import { getReferralByCode, updateReferral } from 'libs/queries/referrals/referral.queries';
import { PaymentDateCalculator } from 'libs/utils/paymentdatecalculator/paymentDateCalculator';

export class Aggregator extends DBStreamRunner<Referral> {
  enrollment: 'not_enrolled' | 'new_enrolled' | 'past_enrolled' | undefined;
  referrer: Referral | null = null;
  referree!: Referral;
  constructor(public campaign: Campaign, public record: DynamoDBRecord) {
    super(record);
    this.init();
  }
  init(): void {
    super.init();
    this.setEnrollment();
    this.setReferree();
    this.setReferrer();
  }

  setReferree(): void {
    this.referree = this.currImage;
  }

  async setReferrer(): Promise<void> {
    this.referrer = (await this.getReferrer()) || null;
  }

  async getReferrer(): Promise<Referral | null> {
    const { referredByCode } = this.currImage;
    if (!referredByCode) return null;
    return await getReferralByCode(referredByCode);
  }

  setEnrollment(): void {
    const prior = this.priorImage?.enrolled || false;
    const curr = this.currImage.enrolled;
    this.enrollment = curr ? (!prior ? 'new_enrolled' : 'past_enrolled') : 'not_enrolled';
  }

  async qualifyReferral(): Promise<void> {
    if (!this.isCampaignActive()) return;
    if (this.enrollment === 'new_enrolled') {
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
    await this.updateReferral(updated);
  }

  async creditReferree(): Promise<void> {
    if (!this.referree || !Object.keys(this.referree).length) return;
    if (!(this.campaign.addOnFlagOne === 'enrollment')) return;
    let updated = { ...this.referree };
    // keep in this order
    updated = { ...updated, ...this.incrementAddOn(updated) };
    updated = { ...updated, ...this.getPaymentDate(updated) };
    await this.updateReferral(updated);
  }

  async updateReferral(referral: Referral): Promise<void> {
    await updateReferral(referral);
  }

  getPaymentDate(referrer: Referral): { nextPaymentDate: string } {
    const bonusOrMax = this.inBonusOrMax(referrer);
    const nextPaymentDate = new PaymentDateCalculator().calcPaymentDate(bonusOrMax, this.campaign.endDate);
    return { nextPaymentDate };
  }

  inBonusOrMax(referrer: Referral): boolean {
    const { campaignActiveReferred: referred } = referrer;
    const { bonusThreshold: bonus, maxReferrals: max } = this.campaign;
    if (!referred) return false;
    const reachedMax = referred >= max && max > 0;
    const reachedBonus = referred >= bonus && bonus > 0;
    return reachedBonus || reachedMax;
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
    const { denomination } = this.campaign;
    let { campaignActiveAddOn, totalAddOn } = referree;
    if (campaignActiveAddOn > 0) return { campaignActiveAddOn, totalAddOn }; // can only get it once
    campaignActiveAddOn += denomination;
    totalAddOn += denomination;
    return { campaignActiveAddOn, totalAddOn };
  }
}
