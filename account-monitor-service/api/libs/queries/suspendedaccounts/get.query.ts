import { DynamoDB } from 'aws-sdk';
import GetSuspendedAccount from 'libs/classes/suspendedaccounts/getsuspendedaccount';

export const getSuspendedAccount = async (id: string): Promise<AWS.DynamoDB.DocumentClient.AttributeMap | null> => {
  const now = new Date().toISOString();
  const params = {
    TableName: process.env.APPDATA || '',
    ScanIndexForward: false,
    ConsistentRead: false,
    KeyConditionExpression: '#04ff0 = :04ff0',
    FilterExpression: '#04ff1 = :04ff1',
    ExpressionAttributeValues: {
      ':04ff0': id,
      ':04ff1': 'suspended',
    },
    ExpressionAttributeNames: {
      '#04ff0': 'id',
      '#04ff1': 'status',
    },
  };

  const db = new GetSuspendedAccount(new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' }), params);

  try {
    await db.execute();
    const { output } = db;
    return output;
  } catch (err) {
    return null;
  }
};
