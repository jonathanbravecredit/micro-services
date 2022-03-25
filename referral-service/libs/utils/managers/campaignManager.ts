import { DynamoDBRecord } from 'aws-lambda';
import { Campaign } from 'libs/models/campaigns/campaign.model';
import { Referral } from 'libs/models/referrals/referral.model';
import {
  getActiveCampaignReferrals,
  getEligibileReferrals,
  updateReferralCampaign,
} from 'libs/queries/referrals/referral.queries';
import { DBStreamRunner } from 'libs/utils/dynamodb/dbStreamRunner';

export class CampaignManager extends DBStreamRunner<Campaign> {
  constructor(public record: DynamoDBRecord, public nocampaign: Campaign) {
    super(record);
    this.init();
  }

  init(): void {
    super.init();
  }

  async process(): Promise<void> {
    if (this.event !== 'MODIFY') return;
    if (this.isDisabled()) await this.disableCampaign();
    else if (this.isEnabled()) await this.enableCampaign();
  }

  isDisabled(): boolean {
    const { pKey, version, campaign, currentVersion: currCV } = this.currImage;
    const { currentVersion: priorCV } = this.priorImage!;
    const isMasterRecord = pKey === 1 && version === 0;
    const isVersionChange = priorCV !== currCV;
    const isNoCampaign = campaign === this.nocampaign.campaign;
    return isMasterRecord && isVersionChange && isNoCampaign;
  }

  isEnabled(): boolean {
    const { pKey, version, campaign, currentVersion: currCV } = this.currImage;
    const { currentVersion: priorCV } = this.priorImage!;
    const isMasterRecord = pKey === 1 && version === 0;
    const isVersionChange = priorCV !== currCV;
    const isValidCampaign = campaign !== this.nocampaign.campaign;
    const isNotNoCampaign = campaign !== 'NO_CAMPAIGN';
    return isMasterRecord && isVersionChange && isValidCampaign && isNotNoCampaign;
  }

  async disableCampaign(): Promise<void> {
    try {
      const actives = await this.listReferralsByCampaign();
      if (!actives || !actives.length) return;
      await Promise.all(
        actives.map(async (referral) => {
          const reset = this.resetReferral(referral);
          try {
            await this.updateReferral(reset);
          } catch (err) {
            console.error(err);
          }
        }),
      );
    } catch (err) {
      console.error(err);
    }
  }

  async enableCampaign(): Promise<void> {
    try {
      const eligibles = await this.listReferralsByEligible();
      if (!eligibles || !eligibles.length) return;
      await Promise.all(
        eligibles.map(async (referral) => {
          try {
            await this.updateReferral(referral);
          } catch (err) {
            console.error(err);
          }
        }),
      );
    } catch (err) {
      console.error(err);
    }
  }

  async listReferralsByCampaign(): Promise<Referral[] | undefined> {
    if (!this.priorImage) return;
    const { campaign } = this.priorImage;
    return await getActiveCampaignReferrals(campaign);
  }

  async listReferralsByEligible(): Promise<Referral[]> {
    return await getEligibileReferrals();
  }

  async updateReferral(referral: Referral): Promise<void> {
    const { id } = referral;
    const { campaign } = this.currImage;
    await updateReferralCampaign(id, campaign);
  }

  /**
   * 1. update the campaign to the default
   * 2. move the current campaign values to the prior campaign attributes
   * 3. reset the notification flag, so we can better control emails.
   * @param referral
   * @returns
   */
  resetReferral(referral: Referral): Referral {
    const now = new Date().toISOString();
    const active = {
      campaignActive: this.currImage.campaign,
      campaignActiveReferred: 0,
      campaignActiveEarned: 0,
      campaignActivePaid: 0,
      campaignActiveAddOn: 0,
      campaignActiveBonus: 0,
    };
    const prior = {
      campaignPrior: this.priorImage!.campaign,
      campaignPriorReferred: referral.campaignActiveReferred,
      campaignPriorEarned: referral.campaignActiveEarned,
      campaignPriorPaid: referral.campaignActivePaid,
      campaignPriorAddOn: referral.campaignActiveAddOn,
      campaignPriorBonus: referral.campaignActiveBonus,
    };
    return {
      ...referral,
      ...active,
      ...prior,
      nextPaymentDate: '',
      notified: false,
      modifiedOn: now,
    };
  }
}
