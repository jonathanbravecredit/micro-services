import { DynamoDBRecord } from 'aws-lambda';
import { Referral } from 'libs/models/referrals/referral.model';
import { updateReferral } from 'libs/queries/referrals/referral.queries';
import { DBStreamRunner } from 'libs/utils/dynamodb/dbStreamRunner';

export class ReferralManager extends DBStreamRunner<Referral> {
  constructor(public record: DynamoDBRecord) {
    super(record);
    this.init();
  }

  init(): void {
    super.init();
  }

  get needsSuspending(): boolean {
    if (!this.priorImage) return false;
    const { suspended: prior } = this.priorImage;
    const { suspended: curr } = this.currImage;
    return !prior && curr;
  }
  async handleSuspensions(): Promise<void> {
    if (this.needsSuspending) this.suspendReferral();
  }

  async suspendReferral(): Promise<void> {
    const updated = {
      ...this.currImage,
      eligible: 0,
      suspended: true,
      campaignActive: 'NO_CAMPAIGN',
      campaignActiveReferred: 0,
      campaignActiveEarned: 0,
      campaignActivePaid: 0,
      campaignActiveAddOn: 0,
      campaignActiveBonus: 0,
      campaignPrior: 'NO_CAMPAIGN',
      campaignPriorReferred: 0,
      campaignPriorEarned: 0,
      campaignPriorPaid: 0,
      campaignPriorAddOn: 0,
      campaignPriorBonus: 0,
      nextPaymentDate: 'SUSPENDED',
    } as Referral;
    await this.updateReferral(updated);
  }

  async updateReferral(referral: Referral): Promise<void> {
    await updateReferral(referral);
  }
}
