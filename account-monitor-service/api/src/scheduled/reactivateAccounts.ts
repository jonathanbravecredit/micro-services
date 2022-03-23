import { Handler, ScheduledHandler } from 'aws-lambda';
import { getSuspendedAccount } from 'libs/queries/suspendedaccounts/get.query';
import { getSuspendedAccounts } from 'libs/queries/suspendedaccounts/list.query';
import { updateSuspendedAccount } from 'libs/queries/suspendedaccounts/update.query';

interface List {
  list: string[];
}
export interface ListOrScheduled extends ScheduledHandler, List {}

export const main: Handler<ListOrScheduled, void> = async (event: ListOrScheduled): Promise<void> => {
  const { list } = event;
  if (list && list.length) {
    // manual upload of list
    try {
      await Promise.all(
        list.map(async (id) => {
          try {
            const suspended = await getSuspendedAccount(id);
            if (suspended == null || !suspended.id) return;
            await updateSuspendedAccount(suspended.id);
          } catch (err) {
            console.error(err);
          }
        }),
      );
    } catch (err) {
      console.error(err);
    }
  } else {
    // scheduled run
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
  }
};
