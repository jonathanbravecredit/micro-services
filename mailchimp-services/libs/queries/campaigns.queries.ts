import "reflect-metadata";
import { DynamoStore } from "@shiftcoders/dynamo-easy";
import { Campaign } from "@bravecredit/brave-sdk";

const store = new DynamoStore(Campaign);

export const getCampaign = (
  pkey: number,
  skey: number
): Promise<Campaign | null> => {
  return store
    .get(pkey, skey)
    .exec()
    .then((res) => res)
    .catch((err) => {
      console.log("getCampaign error: ", JSON.stringify(err));
      return err;
    });
};

export const listCampaigns = (): Promise<Campaign[]> => {
  return store
    .scan()
    .execFetchAll()
    .then((res) => res)
    .catch((err) => {
      console.log("listCampaigns error: ", JSON.stringify(err));
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
      console.log("createCampaign error: ", JSON.stringify(err));
      return err;
    });
};

export const updateCurrentCampaign = (campaign: Campaign): Promise<void> => {
  const now = new Date().toISOString();
  return store
    .update(1, 0)
    .updateAttribute("currentVersion")
    .set(campaign.currentVersion)
    .updateAttribute("campaign")
    .set(campaign.campaign)
    .updateAttribute("denomination")
    .set(campaign.denomination)
    .updateAttribute("bonusThreshold")
    .set(campaign.bonusThreshold)
    .updateAttribute("bonusAmount")
    .set(campaign.bonusAmount)
    .updateAttribute("addOnFlagOne")
    .set(campaign.addOnFlagOne || "")
    .updateAttribute("addOnFlagTwo")
    .set(campaign.addOnFlagTwo || "")
    .updateAttribute("addOnFlagThree")
    .set(campaign.addOnFlagThree || "")
    .updateAttribute("startDate")
    .set(campaign.startDate)
    .updateAttribute("endDate")
    .set(campaign.endDate)
    .updateAttribute("modifiedOn")
    .set(now)
    .exec()
    .then((res) => res)
    .catch((err) => {
      console.log("updateCurrentCampaign Error: ", JSON.stringify(err));
      return err;
    });
};

// {
//   pKey: 1,
//   version: 1,
//   campaign: 'NO_CAMPAIGN',
//   denomination: 0,
//   bonusThreshold: 9999,
//   bonusAmount: 0,
//   addOnFlagOne: '',
//   addOnFlagTwo: ''
//   addOnFlagThree: '',
//   startDate: '9999-12-01T00:00:00.000Z',
//   endDate: '9999-12-01T00:00:00.000Z',
//   createdOn: '2022-01-19T20:48:30.862Z',
//   modifiedOn: '2022-01-19T20:48:30.862Z',
// }

export const getLatestCampaign = (pkey: number): Promise<Campaign[]> => {
  return store
    .query()
    .wherePartitionKey(pkey)
    .descending()
    .limit(1)
    .exec()
    .then((res) => res)
    .catch((err) => {
      console.log("getLatestCampaign error: ", JSON.stringify(err));
      return err;
    });
};
