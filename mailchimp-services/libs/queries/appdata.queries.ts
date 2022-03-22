import { AttributeValue } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { IBatchMsg, IAttributeValue } from 'libs/interfaces/batch.interfaces';
const db = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });
const tableName = process.env.APPTABLE || '';

export const sortByDate = (a: { createdOn: number }, b: { createdOn: number }) => {
  if (a.createdOn > b.createdOn) {
    return -1;
  } else return 1;
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

export const getItemsInDB = (id: any): Promise<DynamoDB.DocumentClient.GetItemOutput> => {
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

export const updateItemInDB = (id: any, data: { customerEmail: any; brokerCode: any }) => {
  let timeStamp = new Date().toUTCString(); //always have last updated date
  const params = {
    TableName: tableName,
    Key: {
      customerId: id,
    },
    // ConditionExpression: 'attribute_exists(queryParam.tableId)',
    UpdateExpression: 'set customerEmail = :e, brokerCode = :d, modifiedOnUTC = :t',
    ExpressionAttributeValues: {
      ':e': data.customerEmail,
      ':d': data.brokerCode,
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

export const updateNavbarCreditReportBadge = (
  id: string,
  payload: { report: { badge: boolean } },
): Promise<DynamoDB.DocumentClient.UpdateItemOutput> => {
  let timeStamp = new Date().toISOString(); //always have last updated date

  const params = {
    TableName: tableName,
    Key: {
      id: id,
    },
    // ConditionExpression: 'attribute_exists(queryParam.tableId)',
    UpdateExpression: 'SET #n.#r = :r, updatedAt = :m',
    ExpressionAttributeNames: {
      '#n': 'navBar',
      '#r': 'report',
    },
    ExpressionAttributeValues: {
      ':r': payload.report || { badge: false },
      ':m': timeStamp,
    },
  };

  console.log('params: ', JSON.stringify(params));
  return db.update(params).promise();
};

export const parallelScanAppData = async (
  esk: { [key: string]: AttributeValue } | undefined,
  segment: number,
  totalSegments: number,
): Promise<IBatchMsg<IAttributeValue> | undefined> => {
  let params: DynamoDB.DocumentClient.ScanInput = {
    TableName: tableName, // I need a big table for testing
    ExclusiveStartKey: esk,
    Segment: segment,
    TotalSegments: totalSegments,
  };
  try {
    const items: DynamoDB.DocumentClient.ScanOutput = await db.scan(params).promise();
    const { LastEvaluatedKey, Items } = items;
    // write the records to the reports table
    // then write the key back
    return {
      lastEvaluatedKey: LastEvaluatedKey,
      items: Items,
      segment: segment,
      totalSegments: totalSegments,
    };
  } catch (err) {
    console.log('err ==> ', err);
  }
};
