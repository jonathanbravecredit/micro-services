import 'reflect-metadata';
import { SNSEvent, SNSEventRecord, SNSHandler } from 'aws-lambda';
import { UpdateAppDataInput } from 'libs/aws/api.service';
import { ISession } from 'libs/interfaces/api/sessions/session.interface';
import { Referral, ReferralMaker } from 'libs/models/referrals/referral.model';
import {
  getCampaign,
  updateReferralCampaign,
  updateReferralEligibility,
  updateEnrollment,
  getReferral,
  createReferral,
} from 'libs/queries';
import { listUserSessions } from 'libs/queries/sessions/sessions.queries';
import * as dayjs from 'dayjs';
import * as uuid from 'uuid';

export const main: SNSHandler = async (event: SNSEvent): Promise<void> => {
  /*============================================*/
  //      SESSION UPDATES
  /*============================================*/
  const sessions = event.Records.filter((r) => {
    const t1 = r.Sns.Subject === 'sessiondataupdate';
    const { service } = JSON.parse(r.Sns.Message) as { service: string; command: string; message: ISession };
    const t2 = service === 'referralservice';
    return t1 && t2;
  });

  sessions.forEach((r: SNSEventRecord) => {
    console.log('referral active monitor record: ', JSON.stringify(r));
  });

  // checks if a user is eligible
  //  -- if so, updates there eligibility
  //     and enrolls them in the current campaign.
  try {
    await Promise.all(
      sessions.map(async (r) => {
        const { message } = JSON.parse(r.Sns.Message) as { service: string; command: string; message: ISession };
        const referral = await getReferral(message.userId);
        if (referral?.eligible) return; // already eligible
        const sessions = await listUserSessions(message.userId, 20);
        // count up special click events...i.e. opening a dispute
        const clickEvents = sessions.reduce((a, b) => {
          return a + (b.clickEvents || 0);
        }, 0);

        if (clickEvents > 0) {
          // auto approve
          // 1. update the campaign to current...must be first
          //  - the campaign can't be expired...otherwise use the default
          const current = await getCampaign(1, 0);
          const defaultCamp = await getCampaign(1, 1);
          const now = new Date();
          const campaign = dayjs(now).isAfter(current!.endDate) ? defaultCamp : current;
          // 2. double check there is a referral
          const referral = await getReferral(message.userId);
          // 3. check if they or who referred them is suspended
          const suspended = suspensionCheck(referral);
          if (suspended) return;

          if (!referral) {
            const newReferral = new ReferralMaker(message.userId, uuid.v4());
            await createReferral({
              ...newReferral,
              enrolled: true,
            });
          }
          // 3. set the campaign to the current one
          await updateReferralCampaign(message.userId, campaign!.campaign);
          // 4. update the eligible flag to 1/true;
          await updateReferralEligibility(message.userId, 1);
        }
      }),
    );
  } catch (err) {
    console.log('error in referral active monitor: ', JSON.stringify(err));
  }

  /*============================================*/
  //      APP DATA UPDATES
  /*============================================*/
  const appdata = event.Records.filter((r) => {
    const t1 = r.Sns.Subject === 'transunionenrollment';
    const { service } = JSON.parse(r.Sns.Message) as { service: string; command: string; message: UpdateAppDataInput };
    const t2 = service === 'referralservice';
    return t1 && t2;
  });

  // enrollments only
  try {
    await Promise.all(
      appdata.map(async (r) => {
        const { message } = JSON.parse(r.Sns.Message) as {
          service: string;
          command: string;
          message: UpdateAppDataInput;
        };
        const { id } = message;
        // 1. double check there is a referral
        //   - if not create one
        const referral = await getReferral(message.id);
        if (!referral) {
          const newReferral = new ReferralMaker(message.id, uuid.v4());
          await createReferral({
            ...newReferral,
            enrolled: true,
          }); // this will miss
        } else {
          await updateEnrollment(id);
        }
      }),
    );
  } catch (err) {
    console.log('error in referral active monitor: ', JSON.stringify(err));
  }
};

/**
 * Helper method to return the suspension status.
 * - was more complex but keep in place for now
 * @param referral
 * @returns
 */
export const suspensionCheck = (referral: Referral | null): boolean => {
  return referral?.suspended || false;
};
