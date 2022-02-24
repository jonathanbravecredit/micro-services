import { DynamoDB } from 'aws-sdk';
import { PutItemOutput } from 'aws-sdk/clients/dynamodb';
import { DynamoStore } from '@shiftcoders/dynamo-easy';
import { APITransactionLog } from 'libs/models/api-transaction.model';
import { AttributeValue } from 'aws-lambda';
import { IAttributeValue, IBatchMsg } from 'libs/interfaces/batch.interfaces';

const db = new DynamoDB();
const store = new DynamoStore(APITransactionLog);

export const getTransactionLog = (userId: string, transactionid: string): Promise<APITransactionLog> => {
  return store
    .get(userId, transactionid)
    .exec()
    .then((res) => res)
    .catch((err) => err);
};

export const listTransactionLog = (userId: string): Promise<APITransactionLog[]> => {
  return store
    .query()
    .wherePartitionKey(userId)
    .execFetchAll()
    .then((res) => res)
    .catch((err) => err);
};

export const createTransactionLog = (transaction: APITransactionLog): Promise<PutItemOutput> => {
  const createdOn = new Date().toISOString();
  const newTransaction = {
    ...transaction,
    createdOn,
  };
  return store
    .put(newTransaction)
    .ifNotExists()
    .exec()
    .then((res) => res)
    .catch((err) => err);
};

export const parallelScanAPIData = async (
  esk: { [key: string]: AttributeValue } | undefined,
  segment: number,
  totalSegments: number,
): Promise<IBatchMsg<IAttributeValue> | undefined> => {
  let params: DynamoDB.DocumentClient.ScanInput = {
    TableName: 'APITransactionLog', // I need a big table for testing
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
