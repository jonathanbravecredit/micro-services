import 'reflect-metadata';
import { SNSEvent, SNSEventRecord, SNSHandler } from 'aws-lambda';
import { UpdateAppDataInput } from 'lib/aws/api.service';
import { ISession } from 'lib/interfaces/api/sessions/session.interface';
import { ReferralMaker } from 'lib/models/referral.model';
import {
  getCampaign,
  updateReferralCampaign,
  updateReferralEligibility,
  updateEnrollment,
  getReferral,
  createReferral,
} from 'lib/queries';
import { listUserSessions } from 'lib/queries/sessions/sessions.queries';
import * as moment from 'moment';
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
        const sessions = await listUserSessions(message.userId, 20);
        console.log('sessions: ', JSON.stringify(sessions));
        // count pageViews across sessions
        const counters = new Map<string, number>();
        sessions.forEach((a) => {
          const pvs = counters.get(a.sessionId) || 0;
          counters.set(a.sessionId, pvs + (a.pageViews || 0));
        }, 0);
        // count that there is one session with > 1 pageViews and one session with > 0 pageViews
        const uniqueSessions = Array.from(counters).map(([_, pageViews]) => pageViews);
        let overOne = false;
        let overZero = false;
        for (let i = 0; i < uniqueSessions.length; i++) {
          if (overOne && overZero) {
            i = uniqueSessions.length;
          } else {
            if (uniqueSessions[i] >= 2 && !overOne) {
              overOne = true;
            } else if (uniqueSessions[i] >= 2 && !overZero) {
              overZero = true;
            } else if (uniqueSessions[i] >= 1) {
              overZero = true;
            }
          }
        }
        // count up special click events
        const clickEvents = sessions.reduce((a, b) => {
          return a + (b.clickEvents || 0);
        }, 0);

        if ((overOne && overZero) || clickEvents > 0) {
          // auto approve
          // 1. update the campaign to current...must be first
          //  - the campaign can't be expired...otherwise use the default
          const current = await getCampaign(1, 0);
          const defaultCamp = await getCampaign(1, 1);
          const now = new Date();
          const campaign = moment(now).isAfter(current!.endDate) ? defaultCamp : current;
          // 2. double check there is a referral
          //   - if not create one
          const referral = await getReferral(message.userId);
          if (!referral) {
            const newReferral = new ReferralMaker(message.userId, uuid.v4());
            await createReferral({
              ...newReferral,
              campaignActive: campaign!.campaign,
              enrolled: true,
              eligible: 1,
            });
          } else {
            // 3. set the campaign to the current one
            await updateReferralCampaign(message.userId, campaign!.campaign);
            // 4. update the eligible flag to 1/true;
            await updateReferralEligibility(message.userId, 1);
          }
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
          });
        } else {
          // 2. if a user enrolls update the enrolled flag
          await updateEnrollment(id);
        }
      }),
    );
  } catch (err) {
    console.log('error in referral active monitor: ', JSON.stringify(err));
  }
};
