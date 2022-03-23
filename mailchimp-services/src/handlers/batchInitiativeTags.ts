import { SNS } from 'aws-sdk';
import { Handler, ScheduledEvent } from 'aws-lambda';
import { listInitiatives, updateInitiativeSlightly } from 'libs/queries/user-initiative.queries';

export const main: Handler<any, any> = async (event: ScheduledEvent): Promise<void> => {
  const sns = new SNS();
  const pool = process.env.POOL || '';
  // query the initiative table for everything
  let counter = 0;
  const initiatives = await listInitiatives();
  try {
    while (initiatives.length) {
      const queue = initiatives.splice(0, 10);
      await new Promise((resolve) => {
        setTimeout(async () => {
          const deleted = await Promise.all(
            queue.map(async (i) => {
              try {
                await updateInitiativeSlightly(i);
                counter++;
              } catch (err) {
                console.error(err);
              }
            }),
          );
          resolve(deleted);
        }, 1001);
      });
      console.log('initiatives length: ', initiatives.length);
    }
    console.log(`updated: ${counter} records`);
  } catch (err) {
    console.error(err);
  }
};
