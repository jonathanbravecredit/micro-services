import { Handler } from 'aws-lambda';
import { SNS } from 'aws-sdk';
import { getUsers } from 'lib/queries/cognito.queries';
import { PubSubUtil } from 'lib/utils/pubsub/pubsub';
import { ICognitoFormattedData } from 'lib/interfaces/cognito.interfaces';

const POOL = process.env.POOL;
const sns = new SNS({ region: 'us-east-2' });
const pubsub = new PubSubUtil();

export const main: Handler = async (): Promise<void> => {
  const limit = 60;
  const paginationToken = '';

  try {
    const users = await getUsers(paginationToken, limit, POOL);
    if (!users.length) throw 'no users';
    // create the payload with out the auth and agent
    // step 2. going through each record, call fulfill (regardless of last time that the user called fulfill in the app)
    await Promise.all(
      users.map(async (user) => {
        // step 2b. query for the users credit score record
        if (user.email_verified.toLowerCase() != 'true') return;
        const payload = pubsub.createSNSPayload<{ user: ICognitoFormattedData }>('mailchimpbatch', { user });
        await sns.publish(payload).promise();
      }),
    );
    const results = { success: true, error: null, data: `Mailchimp:batch queued ${users.length} records.` };
  } catch (error) {
    console.log('merketing error ==> ', error);
  }
};
