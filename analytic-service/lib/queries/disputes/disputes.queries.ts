import { DynamoDB } from 'aws-sdk';
const db = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });
const tableName = 'Disputes';

export const getItemsInDisputeDB = (id: any): Promise<DynamoDB.DocumentClient.AttributeMap | undefined> => {
  const params = {
    Key: {
      id: id,
    },
    TableName: tableName,
  };
  return db
    .get(params)
    .promise()
    .then((res) => res.Item)
    .catch((err) => err);
};
