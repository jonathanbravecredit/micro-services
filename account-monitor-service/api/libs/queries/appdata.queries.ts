import { AttributeValue } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { IAttributeValue, IBatchMsg } from 'libs/interfaces/batch.interfaces';
import { DynamoDBUtil } from 'libs/utils/dynamodb/dynamodbutil';
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

export const getAllItemsInDB = async (): Promise<DynamoDB.DocumentClient.AttributeMap[]> => {
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

export const getReactivationAccount = async (): Promise<DynamoDB.DocumentClient.AttributeMap[] | null> => {
  const now = new Date().toISOString();
  const params = {
    TableName: tableName,
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

  const db = new DynamoDBUtil(new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' }), params, 'QUERY');

  try {
    await db.execute();
    const { output } = db;
    return output;
  } catch (err) {
    return null;
  }
};
