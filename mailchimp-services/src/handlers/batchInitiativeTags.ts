import { Handler, ScheduledEvent } from 'aws-lambda';
import { listInitiatives } from 'libs/queries/user-initiative.queries';

export const main: Handler<any, any> = async (event: ScheduledEvent): Promise<void> => {
  // query the initiative table for everything
  try {
    const initiatives = await listInitiatives();
    console.log('count: ', initiatives.length);
  } catch (err) {
    console.error(err);
  }
};
