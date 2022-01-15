import { Handler } from 'aws-lambda';
import { AnalyticsMaker } from 'lib/models/analytics.model';
import { createAnalytics } from 'lib/queries';
import * as uuid from 'uuid';

export const main: Handler = async (event: any): Promise<void> => {
  const list: { id: string; event: string; createdOn: string }[] = event.list;
  if (!list.length) return;
  try {
    let counter = 0;
    await Promise.all(
      list.map(async (item) => {
        const session = uuid.v4();
        const analytic = new AnalyticsMaker(item.id, item.event, item.id, session, 'app');
        analytic.createdOn = item.createdOn;
        await createAnalytics(analytic);
        counter++;
      }),
    );
    console.log(`manually created ${counter} actions`);
  } catch (err) {
    console.log('error ==> ', err);
  }
};
