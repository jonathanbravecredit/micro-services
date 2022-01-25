import 'reflect-metadata';
import { batchDeleteReferrals, listReferrals } from 'lib/queries';
import { Handler, ScheduledEvent } from 'aws-lambda';

export const main: Handler = async (event: ScheduledEvent): Promise<void> => {
  try {
    const referrals = await listReferrals();
    if (!referrals?.length) return;
    let queue = referrals;
    while (queue.length) {
      const next = queue.splice(0, 24);
      await batchDeleteReferrals(next);
    }
    return;
  } catch (err) {
    console.log('general err ===> ', err);
    return;
  }
};
