import { DynamoDB } from 'aws-sdk';
const db = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });
const tableName = 'Disputes';

export const getAllDisputesInDB = async () => {
  let params: { TableName: string; ExclusiveStartKey?: any } = {
    TableName: tableName,
  };

  let scanResults: DynamoDB.DocumentClient.AttributeMap[] = [];
  let items: DynamoDB.DocumentClient.ScanOutput;

  do {
    items = await db.scan(params).promise();
    items.Items?.forEach((item) => scanResults.push(item));
    params.ExclusiveStartKey = items.LastEvaluatedKey;
  } while (typeof items.LastEvaluatedKey != 'undefined');

  return scanResults;
};