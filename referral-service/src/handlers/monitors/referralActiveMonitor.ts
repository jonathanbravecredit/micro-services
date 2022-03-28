import 'reflect-metadata';
import { SNSEvent, SNSHandler } from 'aws-lambda';
import { ISession } from 'libs/interfaces/api/sessions/session.interface';
import { ReferralActivationManager } from 'libs/utils/managers/referralActivationManager';

export const main: SNSHandler = async (event: SNSEvent): Promise<void> => {
  const records = event.Records.filter((r) => {
    const t1 = r.Sns.Subject === 'sessiondataupdate' || r.Sns.Subject === 'transunionenrollment';
    const { service } = JSON.parse(r.Sns.Message) as { service: string; command: string; message: ISession };
    const t2 = service === 'referralservice';
    return t1 && t2;
  });

  try {
    await Promise.all(
      records.map(async (rec) => {
        const subj = rec.Sns.Subject as 'sessiondataupdate' | 'transunionenrollment';
        try {
          const manager = new ReferralActivationManager(rec, subj);
          await manager.init();
          await manager.check();
        } catch (err) {
          console.error(`referralActiveMonitorError:${err}`);
        }
      }),
    );
  } catch (err) {
    console.log('error in referral active monitor: ', JSON.stringify(err));
  }
};
