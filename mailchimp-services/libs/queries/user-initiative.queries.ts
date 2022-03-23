import 'reflect-metadata';
import { DynamoStore } from '@shiftcoders/dynamo-easy';
import { PutItemOutput } from 'aws-sdk/clients/dynamodb';
import { UserInitiative } from 'libs/models/UserInitiative.model';
import dayjs from 'dayjs';

const store = new DynamoStore(UserInitiative);

export const listInitiatives = (): Promise<UserInitiative[]> => {
  return store.scan().execFetchAll();
};

export const getInitiative = (id: string, program: string): Promise<UserInitiative> => {
  return store
    .get(id, program)
    .exec()
    .then((res) => res)
    .catch((err) => err);
};

export const getFutureScoreInitiative = (): Promise<UserInitiative> => {
  return getInitiative('bravecredit', '1');
};

export const getPrograms = (programId: string): Promise<UserInitiative> => {
  return getInitiative('bravecredit', programId);
};

export const createInitiative = (initiative: UserInitiative): Promise<PutItemOutput> => {
  const createdOn = new Date().toISOString();
  const userInitiative = {
    ...initiative,
    createdOn,
    modifiedOn: createdOn,
  };
  return store
    .put(userInitiative)
    .exec()
    .then((res) => userInitiative)
    .catch((err) => {
      console.log('error: ', err);
      return err;
    });
};

export const updateInitiative = (initiative: UserInitiative): Promise<PutItemOutput> => {
  const modifiedOn = new Date().toISOString();
  const userInitiative = {
    ...initiative,
    modifiedOn,
  };
  return store
    .put(userInitiative)
    .exec()
    .then((res) => userInitiative)
    .catch((err) => err);
};

export const updateInitiativeSlightly = (initiative: UserInitiative): Promise<PutItemOutput> => {
  const modifiedOn = dayjs(initiative.modifiedOn).add(1, 'ms').toISOString();
  const userInitiative = {
    ...initiative,
    modifiedOn,
  };
  return store
    .put(userInitiative)
    .exec()
    .then((res) => res)
    .catch((err) => err);
};
