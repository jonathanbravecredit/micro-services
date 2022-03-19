import { DynamoDB } from 'aws-sdk';
import { GetSuspendedAccounts } from 'libs/classes/suspendedaccounts/getsuspendedaccounts';

export const getSuspendedAccounts = async (): Promise<DynamoDB.DocumentClient.AttributeMap[] | null> => {
  const now = new Date().toISOString();
  const params = {
    TableName: process.env.APPDATA || '',
    ScanIndexForward: false,
    IndexName: 'status-index',
    KeyConditionExpression: '#341f0 = :341f0',
    FilterExpression: '#341f1 <= :341f1',
    ExpressionAttributeValues: {
      ':341f0': 'suspended',
      ':341f1': now,
    },
    ExpressionAttributeNames: {
      '#341f0': 'status',
      '#341f1': 'nextStatusModifiedOn',
    },
  };
  console.log('params: ==> ', params);
  console.log('process.env: ==> ', JSON.stringify(process.env));
  const db = new GetSuspendedAccounts(new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' }), params);

  try {
    await db.execute();
    const { output } = db;
    return output;
  } catch (err) {
    return null;
  }
};
