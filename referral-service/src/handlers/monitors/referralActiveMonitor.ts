import { SNSEvent, SNSEventRecord, SNSHandler } from 'aws-lambda';
import { ISession } from 'lib/interfaces/api/sessions/session.interface';
import { updateReferralEligibility } from 'lib/queries';
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

  try {
    await Promise.all(
      records.map(async (r) => {
        const { message } = JSON.parse(r.Sns.Message) as { service: string; command: string; message: ISession };
        const sessions = await listUserSessions(message.userId, 20);
        console.log('sessions: ', JSON.stringify(sessions));
        const keyPageViews = sessions.reduce((a, b) => {
          return a + b.pageViews;
        }, 0);
        console.log('pageViews: ', keyPageViews);
        if (keyPageViews > 3 && sessions.length > 1) {
          // auto approve
          await updateReferralEligibility(message.userId, 1);
        }
      }),
    );
  } catch (err) {
    console.log('error in referral active monitor: ', JSON.stringify(err));
  }
};
