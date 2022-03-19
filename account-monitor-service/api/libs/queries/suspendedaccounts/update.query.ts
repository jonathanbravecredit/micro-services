import { DynamoDB } from 'aws-sdk';
import { UpdateSuspendedAccount } from 'libs/classes/suspendedaccounts/updatesuspendedaccount';

const tableName = process.env.APPTABLE || '';

export const updateSuspendedAccount = async (
  id: string,
): Promise<AWS.DynamoDB.DocumentClient.UpdateItemOutput | null> => {
  const now = new Date().toISOString();
  const params = {
    TableName: tableName,
    Key: {
      id: id,
    },
    UpdateExpression: 'SET #bdd20 = :bdd20, #bdd21 = :bdd21, #bdd22 = :bdd22',
    ExpressionAttributeValues: {
      ':bdd20': 'active',
      ':bdd21': 'active',
      ':bdd22': 'Reactivated after end of suspension period',
    },
    ExpressionAttributeNames: {
      '#bdd20': 'status',
      '#bdd21': 'statusReason',
      '#bdd22': 'statusReasonDescription',
    },
  };
  console.log('params: ==> ', params);
  const db = new UpdateSuspendedAccount(new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' }), params);

  try {
    await db.execute();
    const { output } = db;
    return output;
  } catch (err) {
    return null;
  }
};
