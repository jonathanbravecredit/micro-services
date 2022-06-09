import { DynamoDB } from 'aws-sdk';

const db = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });
const tableName = process.env.APPDATA || '';

export const sortByDate = (a: { createdOn: number }, b: { createdOn: number }) => {
  if (a.createdOn > b.createdOn) {
    return -1;
  } else return 1;
};

export const getItemsInDB = (reportId: any, tableName: any) => {
  const params = {
    TableName: tableName,
    KeyConditionExpression: '#reportId = :r',
    ExpressionAttributeNames: {
      '#reportId': 'reportId',
    },
    ExpressionAttributeValues: {
      ':r': reportId,
    },
  };
  return db
    .query(params)
    .promise()
    .then((res) => res)
    .catch((err) => err);
};

export const updateItemInDB = (reportId: any, data: { reportData: any }) => {
  let timeStamp = new Date().toISOString();
  const params = {
    TableName: tableName,
    Key: {
      reportId: reportId,
    },
    // ConditionExpression: 'attribute_exists(queryParam.tableId)',
    UpdateExpression: 'set reportData = :d, lastUpdateDate = :t',
    ExpressionAttributeValues: {
      ':d': data.reportData,
      ':t': timeStamp,
    },
    ReturnValues: 'UPDATED_NEW',
  };

  return db
    .update(params)
    .promise()
    .then((res) => res)
    .catch((err) => err);
};

export const createItemInDB = (tableName: any, post: any) => {
  // post report
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
