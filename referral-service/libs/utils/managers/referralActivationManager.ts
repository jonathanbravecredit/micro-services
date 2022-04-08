import { SNSEventRecord } from 'aws-lambda';
import dayjs from 'dayjs';
import { v4 } from 'uuid';
import { UpdateAppDataInput } from 'libs/aws/api.service';
import { ISession } from 'libs/interfaces/api/sessions/session.interface';
import { SnsMessage } from 'libs/interfaces/aws/sns-message.interface';
import { Campaign } from 'libs/models/campaigns/campaign.model';
import { Referral, ReferralMaker } from 'libs/models/referrals/referral.model';
import { Session } from 'libs/models/sessions/session.model';
import { getCampaign } from 'libs/queries/campaigns/campaigns.queries';
import {
  createReferral,
  getReferral,
  updateEnrollment,
  updateReferral,
  updateReferralCampaign,
  updateReferralEligibility,
} from 'libs/queries/referrals/referral.queries';
import { listUserSessions } from 'libs/queries/sessions/sessions.queries';

export class ReferralActivationManager {
  id: string | null = null;
  campaign: Campaign | null = null;
  campaignNone: Campaign | null = null;
  referral: Referral | null = null;
  sessions: Session[] = [];
  sessionMessage: SnsMessage<ISession> | null = null;
  applicationMessage: SnsMessage<UpdateAppDataInput> | null = null;
  constructor(public record: SNSEventRecord, public subject: 'sessiondataupdate' | 'transunionenrollment') {}

  async init(): Promise<void> {
    console.log('activation record: ', JSON.stringify(this.record));
    console.log('subject: ', this.subject);
    if (this.subject == 'sessiondataupdate') await this.initSessionData();
    if (this.subject == 'transunionenrollment') await this.initApplicationData();
  }

  async initSessionData(): Promise<void> {
    const snsMsg = JSON.parse(this.record.Sns.Message) as SnsMessage<ISession>;
    const msg = snsMsg?.message;
    if (!snsMsg || !msg || !msg.userId) {
      console.error(`no proper message passed: ${JSON.stringify(snsMsg)}`);
      return;
    }
    this.id = msg.userId;
    this.sessionMessage = snsMsg;
    try {
      this.referral = await this.getReferral(this.id);
      this.sessions = await this.listSessions(this.id);
      this.campaign = await this.getCampaign(1, 0);
      this.campaignNone = await this.getCampaign(1, 1);
      console.log('this.referral: ', this.referral);
      console.log('this.sessions: ', this.sessions);
      console.log('this.campaign: ', this.campaign);
      console.log('this.campaignNone: ', this.campaignNone);
    } catch (err) {
      console.error(`manager:initSessionData:${err}`);
    }
  }

  async initApplicationData(): Promise<void> {
    const snsMsg = JSON.parse(this.record.Sns.Message) as SnsMessage<UpdateAppDataInput>;
    const msg = snsMsg?.message;
    if (!snsMsg || !msg || !msg.id) {
      console.error(`no proper message passed: ${JSON.stringify(snsMsg)}`);
      return;
    }
    console.log('here`');
    this.id = msg.id;
    this.applicationMessage = snsMsg;
    try {
      this.referral = await this.getReferral(this.id);
      console.log('referral: ==> ', this.referral);
    } catch (err) {
      console.error(`manager:initApplicationData:${err}`);
    }
  }

  async check(): Promise<void> {
    if (this.subject == 'sessiondataupdate') {
      console.log('hereA:');
      if (!this.id) return;
      console.log('hereB:');
      const check = this.checkSessionData();
      console.log('checkZ:', check);
      if (check) await this.activateOnSessionData();
    }
    if (this.subject == 'transunionenrollment') {
      console.log('here3:');
      if (!this.id) return;
      console.log('here3:');
      const check = this.checkApplicationData();
      console.log('check:', check);
      if (check) await this.activateOnApplicationData();
    }
  }

  checkSessionData(): boolean {
    const t1 = this.eligibleCheckOne();
    const t2 = this.eligibleCheckTwo();
    const t3 = this.eligibleCheckThree();
    console.log('t1: ', t1);
    console.log('t2: ', t2);
    console.log('t3: ', t3);
    return t1 && t2 && t3;
  }

  checkApplicationData(): boolean {
    const t1 = this.eligibleCheckFour();
    return t1;
  }

  async getReferral(id: string): Promise<Referral | null> {
    return await getReferral(id);
  }
  async createReferral(referral: Referral): Promise<void> {
    return await createReferral(referral);
  }
  async updateReferral(referral: Referral): Promise<void> {
    return await updateReferral(referral);
  }
  async getCampaign(pkey: number, version: number): Promise<Campaign | null> {
    return await getCampaign(pkey, version);
  }
  async updateReferralCampaign(id: string, campaign: string): Promise<void> {
    return await updateReferralCampaign(id, campaign);
  }
  async updateReferralEligibility(id: string): Promise<void> {
    return await updateReferralEligibility(id, 1);
  }
  async updateEnrollment(id: string): Promise<Referral> {
    return await updateEnrollment(id);
  }
  async listSessions(id: string, limit: number = 20): Promise<Session[]> {
    return await listUserSessions(id, limit);
  }

  /**
   * Check if already eligible. Should not be.
   * @returns
   */
  eligibleCheckOne(): boolean {
    return (this.referral?.eligible || 0) === 0;
  }
  /**
   * Check if they had a key click event (i.e. Disputed)
   * @returns
   */
  eligibleCheckTwo(): boolean {
    if (!this.sessions) return false;
    return (
      this.sessions.reduce((a, b) => {
        return a + (b.clickEvents || 0);
      }, 0) > 0
    );
  }
  /**
   * Make sure we didn't suspend them for suspicious activity
   * @returns
   */
  eligibleCheckThree(): boolean {
    return !this.referral?.suspended;
  }
  /**
   * Make sure the application data is enrolled
   * @returns
   */
  eligibleCheckFour(): boolean {
    return this.applicationMessage?.message.agencies?.transunion?.enrolled || false;
  }

  async activateOnSessionData(): Promise<void> {
    try {
      const campaign = dayjs(new Date()).isAfter(this.campaign!.endDate) ? this.campaignNone : this.campaign;
      if (!this.id) return;
      if (!this.referral) {
        console.log('here7');
        const referral = new ReferralMaker(this.id, v4());
        const update1 = {
          ...referral,
          enrolled: true,
          eligible: 1,
        } as Referral;
        await this.createReferral(update1);
        await this.updateReferral({ ...update1, campaignActive: campaign!.campaign }); // to trick the email going out
      } else {
        console.log('here8');
        const update2 = {
          ...this.referral,
          campaignActive: campaign!.campaign,
          eligible: 1,
        } as Referral;
        await this.updateReferral(update2);
      }
    } catch (err) {
      console.error(`manager:activateOnSessionData:${err}`);
    }
  }

  async activateOnApplicationData(): Promise<void> {
    console.log('activate:this.id:', this.id);
    console.log('activate:this.referral:', this.referral);
    try {
      if (!this.id) return;
      if (!this.referral) {
        const referral = new ReferralMaker(this.id, v4());
        await this.createReferral({ ...referral, enrolled: true });
      } else {
        console.log('here6');
        const res = await this.updateEnrollment(this.id);
        console.log('res', res);
      }
    } catch (err) {
      console.error(`manager:activateOnApplicationData:${err}`);
    }
  }
}
