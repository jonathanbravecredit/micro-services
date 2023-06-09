import { DynamoDBRecord } from "aws-lambda";
import { DBStreamRunner } from "libs/utils/dynamodb/dbStreamRunner";
import { ReferralQueries, Referral } from "@bravecredit/brave-sdk";

export class ReferralSuspensionManager extends DBStreamRunner<Referral> {
  constructor(public record: DynamoDBRecord) {
    super(record);
  }

  init(): void {
    console.log("suspension record: ", JSON.stringify(this.record));
    super.init();
  }

  get needsSuspending(): boolean {
    if (!this.priorImage) return false;
    if (!this.currImage) return false;
    const { suspended: prior } = this.priorImage;
    const { suspended: curr } = this.currImage;
    return !prior && curr;
  }
  async handleSuspensions(): Promise<void> {
    if (this.needsSuspending) await this.suspendReferral();
  }

  async suspendReferral(): Promise<void> {
    const updated = {
      ...this.currImage,
      eligible: 0,
      suspended: true,
      campaignActive: "NO_CAMPAIGN",
      campaignActiveReferred: 0,
      campaignActiveEarned: 0,
      campaignActivePaid: 0,
      campaignActiveAddOn: 0,
      campaignActiveBonus: 0,
      campaignPrior: "NO_CAMPAIGN",
      campaignPriorReferred: 0,
      campaignPriorEarned: 0,
      campaignPriorPaid: 0,
      campaignPriorAddOn: 0,
      campaignPriorBonus: 0,
      nextPaymentDate: "SUSPENDED",
    } as Referral;
    await this.updateReferral(updated);
  }

  async updateReferral(referral: Referral): Promise<void> {
    await ReferralQueries.updateReferral(referral);
  }
}
