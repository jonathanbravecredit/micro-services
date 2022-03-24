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
    if (!this.referrer) return;
    const { campaignActiveEarned, totalEarned } = this.incrementBase(this.referrer);
    const { campaignActiveBonus, totalBonus } = this.incrementBonus(this.referrer);
    const { campaignActiveReferred, totalReferred } = this.incrementCount(this.referrer);
    const nextPaymentDate = this.getPaymentDate(this.referrer);
    const updated = {
      ...this.referrer,
      campaignActiveReferred,
      campaignActiveEarned,
      campaignActiveBonus,
      totalReferred,
      totalEarned,
      totalBonus,
      nextPaymentDate,
    };
    await this.updateReferral(updated);
  }

  async creditReferree(): Promise<void> {
    if (!(this.campaign.addOnFlagOne === 'enrollment')) return;
    const { campaignActiveAddOn, totalAddOn } = this.incrementAddOn(this.referree);
    const nextPaymentDate = this.getPaymentDate(this.referree);
    const updated = {
      ...this.referree,
      campaignActiveAddOn,
      totalAddOn,
      nextPaymentDate,
    };
    await this.updateReferral(updated);
  }

  async updateReferral(referral: Referral): Promise<void> {
    await updateReferral(referral);
  }

  getPaymentDate(referrer: Referral): string {
    const bonusOrThreshold = this.inBonusOrThreshold(referrer);
    return new PaymentDateCalculator().calcPaymentDate(bonusOrThreshold, this.campaign.endDate);
  }

  inBonusOrThreshold(referrer: Referral): boolean {
    const { campaignActiveReferred: referred } = referrer;
    const { bonusThreshold: threshold, maxReferrals: max } = this.campaign;
    return (referred >= threshold && threshold > 0) || referred >= max ? true : false;
  }

  incrementBase(referrer: Referral): { campaignActiveEarned: number; totalEarned: number } {
    const { denomination } = this.campaign;
    const campaignActiveEarned = referrer.campaignActiveEarned + denomination;
    const totalEarned = referrer.totalEarned + denomination;
    return { campaignActiveEarned, totalEarned };
  }

  incrementCount(referrer: Referral): { campaignActiveReferred: number; totalReferred: number } {
    const campaignActiveReferred = referrer.campaignActiveReferred + 1;
    const totalReferred = referrer.totalReferred + 1;
    return { campaignActiveReferred, totalReferred };
  }

  incrementAddOn(referral: Referral): { campaignActiveAddOn: number; totalAddOn: number } {
    const { denomination } = this.campaign;
    const campaignActiveAddOn = referral.campaignActiveAddOn + denomination;
    const totalAddOn = referral.totalAddOn + denomination;
    return { campaignActiveAddOn, totalAddOn };
  }

  incrementBonus(referrer: Referral): { campaignActiveBonus: number; totalBonus: number } {
    const { bonusThreshold, bonusAmount } = this.campaign;
    const bonus = (referrer.campaignActiveReferred || -1) + 1 === bonusThreshold ? bonusAmount : 0;
    const campaignActiveBonus = referrer.campaignActiveBonus + bonus;
    const totalBonus = referrer.totalBonus + bonus;
    return { campaignActiveBonus, totalBonus };
  }
}
