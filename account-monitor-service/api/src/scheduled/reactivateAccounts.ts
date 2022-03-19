import { Handler, ScheduledHandler } from 'aws-lambda';
import { getSuspendedAccounts } from 'libs/queries/suspendedaccounts/list.query';
import { updateSuspendedAccount } from 'libs/queries/suspendedaccounts/update.query';

export const main: Handler<any, any> = async (event: ScheduledHandler): Promise<void> => {
  let counter = 0;
  try {
    const suspended = await getSuspendedAccounts();
    if (suspended == null || !suspended.length) return;
    await Promise.all(
      suspended.map(async (s) => {
        try {
          await updateSuspendedAccount(s.id);
          counter++;
          return;
        } catch (err) {
          console.error(err);
        }
      }),
    );
    console.log(`updated ${counter} records`);
  } catch (err) {
    console.error(err);
  }
};
