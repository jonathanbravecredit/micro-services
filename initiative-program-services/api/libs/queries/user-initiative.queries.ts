import { PutItemOutput } from 'aws-sdk/clients/dynamodb';
import { DynamoStore } from 'dynamo-easy';
import { UserInitiative } from 'libs/models/UserInitiative.model';

const store = new DynamoStore(UserInitiative);

export const getInitiative = (id: string, program: string): Promise<UserInitiative> => {
  return store
    .get(id, program)
    .exec()
    .then((res) => res)
    .catch((err) => err);
};

export const getFutureScoreInitiative = (): Promise<UserInitiative> => {
  return getInitiative('bravecredit', '0');
};

export const getPrograms = (programId: string): Promise<UserInitiative> => {
  return getInitiative('bravecredit', programId);
};

export const createInitiative = (initiative: UserInitiative): Promise<PutItemOutput> => {
  const createdOn = new Date().toISOString();
  const UserInitiative = {
    ...initiative,
    createdOn,
    modifiedOn: createdOn,
  };
  return store
    .put(UserInitiative)
    .ifNotExists()
    .exec()
    .then((res) => res)
    .catch((err) => {
      console.log('error: ', err);
      return err;
    });
};

export const updateInitiative = (initiative: UserInitiative): Promise<PutItemOutput> => {
  const modifiedOn = new Date().toISOString();
  const newDispute = {
    ...initiative,
    modifiedOn,
  };
  return store
    .put(newDispute)
    .exec()
    .then((res) => res)
    .catch((err) => err);
};
