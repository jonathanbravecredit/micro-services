import { SNSEvent, SNSEventRecord, SNSHandler } from 'aws-lambda';
import { ISession } from 'lib/interfaces/api/sessions/session.interface';
import { getCampaign, updateReferralCampaign, updateReferralEligibility } from 'lib/queries';
import { listUserSessions } from 'lib/queries/sessions/sessions.queries';

export const main: SNSHandler = async (event: SNSEvent): Promise<void> => {
  const records = event.Records.filter((r) => {
    const t1 = r.Sns.Subject === 'sessiondataupdate';
    const { service } = JSON.parse(r.Sns.Message) as { service: string; command: string; message: ISession };
    const t2 = service === 'referralservice';
    return t1 && t2;
  });

  records.forEach((r: SNSEventRecord) => {
    console.log('referral active monitor record: ', JSON.stringify(r));
  });

  // checks if a user is eligible
  //  -- if so, updates there eligibility
  //     and enrolls them in the current campaign.
  try {
    await Promise.all(
      records.map(async (r) => {
        const { message } = JSON.parse(r.Sns.Message) as { service: string; command: string; message: ISession };
        const sessions = await listUserSessions(message.userId, 20);
        console.log('sessions: ', JSON.stringify(sessions));
        const keyPageViews = sessions.reduce((a, b) => {
          return a + (b.pageViews || 0);
        }, 0);
        const clickEvents = sessions.reduce((a, b) => {
          return a + (b.clickEvents || 0);
        }, 0);
        console.log('pageViews: ', keyPageViews);
        if ((keyPageViews > 2 && sessions.length > 1) || clickEvents > 0) {
          // auto approve
          await updateReferralEligibility(message.userId, 1);
          const current = await getCampaign(1, 0);
          await updateReferralCampaign(message.userId, current!.campaign);
        }
      }),
    );
  } catch (err) {
    console.log('error in referral active monitor: ', JSON.stringify(err));
  }
};
