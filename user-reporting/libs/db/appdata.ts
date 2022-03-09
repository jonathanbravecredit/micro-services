import { AttributeValue } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { DisputeKeys } from 'libs/interfaces/disputekeys.interfaces';
import { IEnrollUserBatchMsg } from 'libs/interfaces/enrolled-user-report.interface';
const db = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });
const tableName = process.env.APPDATA || '';

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

export const parallelScanAppData = async (
  esk: { [key: string]: AttributeValue } | undefined,
  segment: number,
  totalSegments: number,
): Promise<IEnrollUserBatchMsg | undefined> => {
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

export const getItemInDB = (id: any): Promise<DynamoDB.DocumentClient.GetItemOutput> => {
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

export const updateDisputeKeys = (id: any, keys: DisputeKeys): Promise<DynamoDB.DocumentClient.GetItemOutput> => {
  const params: DynamoDB.DocumentClient.UpdateItemInput = {
    TableName: tableName,
    Key: {
      id: id,
    },
    // ConditionExpression: 'attribute_exists(queryParam.tableId)',
    UpdateExpression: 'set #ag.#tu.#eo = :eo, #ag.#tu.#ek = :ek, #ag.#tu.#fk = :fk',
    ExpressionAttributeNames: {
      '#ag': 'agencies',
      '#tu': 'transunion',
      '#eo': 'disputeEnrolledOn',
      '#ek': 'disputeEnrollmentKey',
      '#fk': 'disputeServiceBundleFulfillmentKey',
    },
    ExpressionAttributeValues: {
      ':eo': keys.disputeEnrolledOn,
      ':ek': keys.disputeEnrollmentKey,
      ':fk': keys.disputeServiceBundleFulfillmentKey,
    },
    ReturnValues: 'UPDATED_NEW',
  };

  return db.update(params).promise();
};
