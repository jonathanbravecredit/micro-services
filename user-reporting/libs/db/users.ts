import { DynamoDB } from 'aws-sdk';
import { mapEnrollmentFields } from 'libs/helpers';
import dayjs from 'dayjs';
const db = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });
const tableName = process.env.APPDATA || '';

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
      customerId: id,
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

export const getAllEnrollmentsInDB = async () => {
  let params: { TableName: string; ExclusiveStartKey?: any } = {
    TableName: tableName,
  };

  let scanResults: DynamoDB.DocumentClient.AttributeMap[] = [];
  let items: DynamoDB.DocumentClient.ScanOutput;

  do {
    items = await db.scan(params).promise();
    items.Items?.forEach((item) => {
      if (item.agencies.transunion.enrolled) {
        scanResults.push(mapEnrollmentFields(item));
      }
    });
    params.ExclusiveStartKey = items.LastEvaluatedKey;
  } while (typeof items.LastEvaluatedKey != 'undefined');

  return scanResults;
};

export const countAllEnrollmentsInDB = async () => {
  let params: { TableName: string; ExclusiveStartKey?: any } = {
    TableName: tableName,
  };

  let count: number = 0;
  let items: DynamoDB.DocumentClient.ScanOutput;

  do {
    items = await db.scan(params).promise();
    items.Items?.forEach((item) => {
      const enrolled = item.agencies.transunion.enrolled;
      const inJan = dayjs(item.createdOn).isSame(new Date(), 'month');
      if (enrolled && inJan) {
        count++;
      }
    });
    params.ExclusiveStartKey = items.LastEvaluatedKey;
  } while (typeof items.LastEvaluatedKey != 'undefined');

  return count;
};

export const countAllFailedInDB = async () => {
  let params: { TableName: string; ExclusiveStartKey?: any } = {
    TableName: tableName,
  };

  let count: number = 0;
  let items: DynamoDB.DocumentClient.ScanOutput;

  do {
    items = await db.scan(params).promise();
    items.Items?.forEach((item) => {
      const failed = item.agencies.transunion.status === 'suspended';
      const inJan = dayjs(item.createdOn).isSame(new Date(), 'month');
      if (failed && inJan) {
        count++;
      }
    });
    params.ExclusiveStartKey = items.LastEvaluatedKey;
  } while (typeof items.LastEvaluatedKey != 'undefined');

  return count;
};

export const getAllSuspendedUsersInDB = async () => {
  let params: { TableName: string; ExclusiveStartKey?: any } = {
    TableName: tableName,
  };

  let scanResults: DynamoDB.DocumentClient.AttributeMap[] = [];
  let items: DynamoDB.DocumentClient.ScanOutput;

  do {
    items = await db.scan(params).promise();
    items.Items?.forEach((item) => {
      if (item.status?.toLowerCase() !== 'active') {
        scanResults.push(mapEnrollmentFields(item));
      }
    });
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
