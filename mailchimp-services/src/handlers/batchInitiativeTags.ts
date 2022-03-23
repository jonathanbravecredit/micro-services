import { SNS } from 'aws-sdk';
import { Handler, ScheduledEvent } from 'aws-lambda';
import { listInitiatives, updateInitiativeSlightly } from 'libs/queries/user-initiative.queries';

export const main: Handler<any, any> = async (event: ScheduledEvent): Promise<void> => {
  const sns = new SNS();
  const pool = process.env.POOL || '';
  // query the initiative table for everything
  try {
    const initiatives = await listInitiatives();
    await Promise.all(
      initiatives.map(async (i) => {
        try {
          await updateInitiativeSlightly(i);
        } catch (err) {
          console.error(err);
        }
      }),
    );
  } catch (err) {
    console.error(err);
  }
};
