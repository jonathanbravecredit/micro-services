import { DynamoDB } from 'aws-sdk';
const db = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });
const tableName = process.env.APPDATA || '';

export const getItemsInDB = (id: any) => {
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



