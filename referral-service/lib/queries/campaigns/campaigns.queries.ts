import { attribute, DynamoStore } from '@shiftcoders/dynamo-easy';
import { Campaign, CAMPAIGNSTATUS_INDEX } from 'lib/models/campaign.model';

const store = new DynamoStore(Campaign);

export const getCampaign = (id: string): Promise<Campaign | null> => {
  return store
    .get(id)
    .exec()
    .then((res) => res)
    .catch((err) => err);
};

export const listCampaigns = (): Promise<Campaign[]> => {
  return store
    .scan()
    .execFetchAll()
    .then((res) => res)
    .catch((err) => err);
};

export const createCampaign = (Campaign: Campaign): Promise<void> => {
  return store
    .put(Campaign)
    .ifNotExists()
    .exec()
    .then((res) => res)
    .catch((err) => err);
};

export const listActiveCampaigns = (): Promise<Campaign[]> => {
  return store
    .query()
    .index(CAMPAIGNSTATUS_INDEX)
    .wherePartitionKey('active')
    .execFetchAll()
    .then((res) => res)
    .catch((err) => err);
};
