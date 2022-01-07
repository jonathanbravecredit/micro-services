import 'reflect-metadata';
import { Handler, ScheduledEvent } from 'aws-lambda';
import { APPROVED_LIST } from 'lib/data/approved-list';
import { approveReferral } from 'lib/queries';
import { response } from 'lib/utils/response';

export const main: Handler = async (event: ScheduledEvent): Promise<void> => {
  try {
    const approved = APPROVED_LIST;
    let counter = 0;
    await Promise.all(
      approved.map(async (id) => {
        const resp = await approveReferral(id);
        counter++;
        return;
      }),
    );
    console.log(`Updated ${counter} records`);
    response(200, 'success');
  } catch (err) {
    response(500, 'failed');
    console.log('err ==> ', err);
  }
};
