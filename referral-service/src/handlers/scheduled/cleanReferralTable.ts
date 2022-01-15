import 'reflect-metadata';
import { listReferrals, updateDeleteReferral } from 'lib/queries';
import { Handler, ScheduledEvent } from 'aws-lambda';
import { getUser } from 'lib/utils/cognito/queries/queries';

export const main: Handler = async (event: ScheduledEvent): Promise<void> => {
  try {
    let removed = 0;
    const referrals = await listReferrals();
    await Promise.all(
      referrals.map(async (r) => {
        try {
          const user = await getUser(r.id);
          if (!user.Username) {
            await updateDeleteReferral(r.id);
            removed++;
          }
        } catch (err: any) {
          const errDesc: string = err;
          if (errDesc.indexOf('UserNotFound')) {
            await updateDeleteReferral(r.id);
            removed++;
          }
        }
        return;
      }),
    );
    console.log(`removed ${removed} no. of referrals`);
  } catch (err) {
    console.log('err ==> ', err);
  }
};
