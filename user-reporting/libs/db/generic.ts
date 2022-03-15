import { AttributeValue } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { IAttributeValue, IBatchMsg, IDynamoOutputs } from 'libs/interfaces/batch.interfaces';
import { ParallelScanParams } from 'libs/interfaces/generic-db.interfaces';

const db = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

export const getItem = (id: any, table: string): Promise<DynamoDB.DocumentClient.GetItemOutput> => {
  const params = {
    Key: {
      id: id,
    },
    TableName: table,
  };
  return db
    .get(params)
    .promise()
    .then((res) => res)
    .catch((err) => err);
};

export const listItems = async (table: string) => {
  let params: { TableName: string; ExclusiveStartKey?: any } = {
    TableName: table,
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

export const pScan = async (
  esk: { [key: string]: AttributeValue } | undefined,
  segment: number,
  totalSegments: number,
  params: ParallelScanParams,
): Promise<IBatchMsg<IAttributeValue> | undefined> => {
  if (!params.table) throw 'no table provided';
  let input: DynamoDB.DocumentClient.ScanInput = {
    TableName: params.table, // I need a big table for testing
    ExclusiveStartKey: esk,
    Segment: segment,
    TotalSegments: totalSegments,
  };
  // map and merge
  Object.entries(params).forEach(([k, v]) => {
    Object.assign(input, { [parallelScanParamMap[k]]: v });
  });
  console.log('genric pScan input', JSON.stringify(input));
  try {
    const items: DynamoDB.DocumentClient.ScanOutput = await db.scan(input).promise();
    const { LastEvaluatedKey, Items } = items;
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

export const query = async (
  esk: { [key: string]: AttributeValue } | undefined,
  table: string,
  index?: string,
): Promise<IDynamoOutputs<IAttributeValue> | undefined> => {
  let params: DynamoDB.DocumentClient.QueryInput = {
    TableName: table, // I need a big table for testing
    ExclusiveStartKey: esk,
  };
  params = index ? Object.assign(params, { IndexName: index }) : params;
  try {
    const items: DynamoDB.DocumentClient.QueryOutput = await db.query(params).promise();
    const { LastEvaluatedKey, Items } = items;
    return {
      lastEvaluatedKey: LastEvaluatedKey,
      items: Items,
    };
  } catch (err) {
    console.log('err ==> ', err);
  }
};

export const parallelScanParamMap: Record<string, string> = {
  table: 'TableName',
  index: 'IndexName',
  condition: 'KeyConditionExpression',
  filter: 'FilterExpression',
  attributes: 'ExpressionAttributeNames',
  values: 'ExpressionAttributeValues',
};
