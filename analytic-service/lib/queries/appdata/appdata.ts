import { DynamoDB } from 'aws-sdk';
const db = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });
const tableName = process.env.APPDATA || '';

export const getItemsInDB = (id: any) => {
  const params = {
    Key: {
      id: id,
    },
    TableName: tableName,
  };
  return db
    .get(params)
    .promise()
    .then((res) => res)
    .catch((err) => err);
};

export const createItemInDB = (post: any) => {
  const params = {
    TableName: tableName,
    Item: post,
  };
  return db
    .put(params)
    .promise()
    .then((res) => res)
    .catch((err) => err);
};

export const getAllItemsInDB = async () => {
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
