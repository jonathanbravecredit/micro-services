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
  params: ParallelScanParams,
): Promise<IBatchMsg<IAttributeValue> | undefined> => {
  if (!params.table) throw 'no table provided';
  let input: DynamoDB.DocumentClient.QueryInput = {
    TableName: params.table, // I need a big table for testing
    ExclusiveStartKey: esk,
  };
  Object.entries(params).forEach(([k, v]) => {
    Object.assign(input, { [parallelScanParamMap[k]]: v });
  });
  console.log('input: ', input);
  try {
    const items: DynamoDB.DocumentClient.QueryOutput = await db.query(input).promise();
    const { LastEvaluatedKey, Items } = items;
    return {
      lastEvaluatedKey: LastEvaluatedKey,
      items: Items,
      segment: 0,
      totalSegments: 1,
    };
  } catch (err) {
    console.log('err ==> ', err);
  }
};

export const parallelScanParamMap: Record<string, string> = {
  table: 'TableName',
  index: 'IndexName',
  key: 'Key',
  condition: 'KeyConditions',
  filter: 'FilterExpression',
  attributes: 'ExpressionAttributeNames',
  values: 'ExpressionAttributeValues',
};
