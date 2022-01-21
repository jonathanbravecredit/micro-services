import { DynamoStore } from '@shiftcoders/dynamo-easy';
import { Campaign } from 'lib/models/campaign.model';

const store = new DynamoStore(Campaign);

export const getCampaign = (pkey: number, skey: number): Promise<Campaign | null> => {
  return store
    .get(pkey, skey)
    .exec()
    .then((res) => res)
    .catch((err) => {
      console.log('getCampaign error: ', JSON.stringify(err));
      return err;
    });
};

export const listCampaigns = (): Promise<Campaign[]> => {
  return store
    .scan()
    .execFetchAll()
    .then((res) => res)
    .catch((err) => {
      console.log('listCampaigns error: ', JSON.stringify(err));
      return err;
    });
};

export const createCampaign = (campaign: Campaign): Promise<void> => {
  return store
    .put(campaign)
    .ifNotExists()
    .exec()
    .then((res) => res)
    .catch((err) => {
      console.log('createCampaign error: ', JSON.stringify(err));
      return err;
    });
};

export const updateCurrentCampaign = (campaign: Campaign) => {
  const now = new Date().toISOString();
  return store
    .update(1, 0)
    .updateAttribute('currentVersion')
    .set(campaign.currentVersion)
    .updateAttribute('campaign')
    .set(campaign.campaign)
    .updateAttribute('denomination')
    .set(campaign.denomination)
    .updateAttribute('bonusThreshold')
    .set(campaign.bonusThreshold)
    .updateAttribute('addOnFlagOne')
    .set(campaign.addOnFlagOne)
    .updateAttribute('addOnFlagTwo')
    .set(campaign.addOnFlagTwo)
    .updateAttribute('addOnFlagThree')
    .set(campaign.addOnFlagThree)
    .updateAttribute('startDate')
    .set(campaign.startDate)
    .updateAttribute('endDate')
    .set(campaign.endDate)
    .updateAttribute('modifiedOn')
    .set(now)
    .exec()
    .then((res) => res)
    .catch((err) => {
      console.log('updateCurrentCampaign Error: ', JSON.stringify(err));
      return err;
    });
};

export const getLatestCampaign = (pkey: number) => {
  return store
    .query()
    .wherePartitionKey(pkey)
    .descending()
    .limit(1)
    .exec()
    .then((res) => res)
    .catch((err) => {
      console.log('getLatestCampaign error: ', JSON.stringify(err));
      return err;
    });
};
