import { DynamoDB } from 'aws-sdk';
import { AttributeValue } from 'aws-lambda';
import { IAttributeValue, IBatchMsg } from 'libs/interfaces/batch.interfaces';

const db = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

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
