import { DynamoStore } from '@shiftcoders/dynamo-easy';
import { Campaign } from 'lib/models/campaign.model';

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

export const deleteCampaign = (id: string): Promise<void> => {
  return store
    .delete(id)
    .returnValues('ALL_OLD')
    .exec()
    .then((res) => res)
    .catch((err) => err);
};

export const updateCampaign = async (campaign: Partial<Campaign>): Promise<Partial<Campaign> | null> => {
  if (!campaign.campaignId) return null;
  const old = await getCampaign(campaign.campaignId);
  if (!old) return null;
  const merge = {
    ...old,
    ...campaign,
  };
  const modifiedOn = new Date().toISOString();
  return store
    .update(merge.campaignId)
    .updateAttribute('status')
    .set(merge.status)
    .updateAttribute('startDate')
    .set(merge.startDate)
    .updateAttribute('endDate')
    .set(merge.endDate)
    .updateAttribute('modifiedOn')
    .set(modifiedOn)
    .returnValues('UPDATED_NEW')
    .exec()
    .then((res) => res)
    .catch((err) => err);
};
