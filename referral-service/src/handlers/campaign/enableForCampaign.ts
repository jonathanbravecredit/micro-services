import 'reflect-metadata';
import { Handler, ScheduledEvent } from 'aws-lambda';
import { APPROVED_LIST } from 'lib/data/approved-list';
import { approveReferral } from 'lib/queries';
import { response } from 'lib/utils/response';
import { getUsers } from 'lib/utils/cognito/queries/queries';

export const main: Handler = async (event: ScheduledEvent): Promise<void> => {
  try {
    let limit = 60;
    let paginationToken = '';
    const userLookup = new Map();
    (await getUsers(paginationToken, limit)).forEach((u) => userLookup.set(u.email, u.sub));

    const approved = APPROVED_LIST;

    let counter = 0;
    await Promise.all(
      approved.map(async (email) => {
        const sub = userLookup.get(email);
        const resp = await approveReferral(sub);
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
