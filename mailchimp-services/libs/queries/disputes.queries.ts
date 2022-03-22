import { PutItemOutput, DeleteItemOutput, UpdateItemOutput } from 'aws-sdk/clients/dynamodb';
import { DynamoStore } from '@shiftcoders/dynamo-easy';
import { Dispute } from 'libs/models/dispute.model';

const store = new DynamoStore(Dispute);

export const getDispute = (id: string, disputeId: string): Promise<Dispute> => {
  return store
    .get(id, disputeId)
    .exec()
    .then((res) => res)
    .catch((err) => err);
};

export const createDispute = (dispute: Dispute): Promise<PutItemOutput> => {
  const createdOn = new Date().toISOString();
  const newDispute = {
    ...dispute,
    createdOn,
    modifiedOn: createdOn,
  };
  return store
    .put(newDispute)
    .ifNotExists()
    .exec()
    .then((res) => res)
    .catch((err) => err);
};

export const updateDispute = (dispute: Dispute): Promise<PutItemOutput> => {
  const modifiedOn = new Date().toISOString();
  const newDispute = {
    ...dispute,
    modifiedOn,
  };
  return store
    .put(newDispute)
    .exec()
    .then((res) => res)
    .catch((err) => err);
};

export const updateDisputeResults = (
  id: string,
  disputeId: string,
  disputeCreditBureau: string,
  disputeInvestigationResults: string,
): Promise<UpdateItemOutput> => {
  const modifiedOn = new Date().toISOString();
  return store
    .update(id, disputeId)
    .updateAttribute('disputeCreditBureau')
    .set(disputeCreditBureau)
    .updateAttribute('disputeInvestigationResults')
    .set(disputeInvestigationResults)
    .updateAttribute('modifiedOn')
    .set(modifiedOn)
    .exec()
    .then((res) => res)
    .catch((err) => err);
};

export const deleteDispute = (id: string, disputeId: string): Promise<DeleteItemOutput> => {
  return store
    .delete(id, disputeId)
    .exec()
    .then((res) => res)
    .catch((err) => err);
};

export const listDisputesById = (id: string): Promise<Dispute[]> => {
  return store
    .query()
    .wherePartitionKey(id)
    .execFetchAll()
    .then((res) => res)
    .catch((err) => err);
};

export const getRandomDisputesById = (id: string): Promise<Dispute[]> => {
  return store
    .query()
    .wherePartitionKey(id)
    .exec()
    .then((res) => res)
    .catch((err) => err);
};
