import { PutItemOutput } from 'aws-sdk/clients/dynamodb';
import { DynamoStore } from '@shiftcoders/dynamo-easy';
import { CreditReport } from 'libs/models/CreditReport.model';
import { DynamoDB } from 'aws-sdk';
import { AttributeValue } from 'aws-lambda';
import { IAttributeValue, IBatchMsg } from 'libs/interfaces/batch.interfaces';

const store = new DynamoStore(CreditReport);
const db = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

export const getReport = (userId: string, version: number): Promise<CreditReport> => {
  return store
    .get(userId, version)
    .exec()
    .then((res) => res)
    .catch((err) => err);
};

export const getCurrentReport = (userId: string): Promise<CreditReport | null> => {
  return store.get(userId, 0).exec();
};

export const createReport = (report: CreditReport): Promise<PutItemOutput> => {
  const createdOn = new Date().toISOString();
  const creditReport = {
    ...report,
    createdOn,
    modifiedOn: createdOn,
  };
  return store
    .put(creditReport)
    .ifNotExists()
    .exec()
    .then((res) => res)
    .catch((err) => {
      console.log('error: ', err);
      return err;
    });
};

export const updateReport = (report: CreditReport): Promise<PutItemOutput> => {
  const modifiedOn = new Date().toISOString();
  const newDispute = {
    ...report,
    modifiedOn,
  };
  return store
    .put(newDispute)
    .exec()
    .then((res) => res)
    .catch((err) => err);
};

export const parallelScanCreditReports = async (
  esk: { [key: string]: AttributeValue } | undefined,
  segment: number,
  totalSegments: number,
): Promise<IBatchMsg<IAttributeValue> | undefined> => {
  let params: DynamoDB.DocumentClient.ScanInput = {
    TableName: 'CreditReports',
    ExclusiveStartKey: esk,
    Segment: segment,
    TotalSegments: totalSegments,
    ProjectionExpression: '#id, #vr, #co',
    ExpressionAttributeNames: {
      '#id': 'userId',
      '#vr': 'version',
      '#co': 'createdOn',
    },
  };
  try {
    const items: DynamoDB.DocumentClient.ScanOutput = await db.scan(params).promise();
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
