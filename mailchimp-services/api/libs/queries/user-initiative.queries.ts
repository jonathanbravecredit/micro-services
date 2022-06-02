import 'reflect-metadata';
import { DynamoStore } from '@shiftcoders/dynamo-easy';
import { PutItemOutput } from 'aws-sdk/clients/dynamodb';
import { UserInitiative } from '@bravecredit/brave-sdk';
import dayjs from 'dayjs';

const store = new DynamoStore(UserInitiative);

export const listInitiatives = (): Promise<UserInitiative[]> => {
  return store.scan().execFetchAll();
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
