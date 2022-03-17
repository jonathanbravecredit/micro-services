import { Handler, ScheduledHandler } from 'aws-lambda';
import { ReactivationData } from 'libs/interfaces/reactivation.interfaces';
import { getReactivationAccount } from 'libs/queries/appdata.queries';

export const main: Handler<any, any> = async (event: ScheduledHandler): Promise<void> => {
  // I need to get all the suspended accounts
  // check the reason for the suspension (handled in query)
  // check if the window for the suspension has passed (handled in query)
  // reset the status to active
  try {
    const reactivations = await getReactivationAccount();
    if (reactivations == null) return;
    const testmap = reactivations.map((r: ReactivationData) => {
      return {
        id: r.id,
        status: r.status,
        nextStatusModifiedOn: r.nextStatusModifiedOn,
        statusReasonDescription: r.statusReasonDescription,
        lastStatusModifiedOn: r.lastStatusModifiedOn,
      };
    });
    console.log('reactivations: ', JSON.stringify(testmap));
  } catch (err) {
    console.error(err);
  }
};
