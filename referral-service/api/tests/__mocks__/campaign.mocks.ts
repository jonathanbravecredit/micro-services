import { DynamoDBRecord } from 'aws-lambda';
import dayjs from 'dayjs';

export const MOCK_CAMPAIGN_RAW_ACTIVE = {
  pKey: {
    N: '1',
  },
  version: {
    N: '0',
  },
  campaign: {
    S: 'mar2022',
  },
  currentVersion: {
    N: '3',
  },
  denomination: {
    N: '5',
  },
  bonusAmount: {
    N: '5',
  },
  bonusThreshold: {
    N: '3',
  },
  maxReferrals: {
    N: '10',
  },
  createdOn: {
    S: '2022-03-08T08:00:00.000Z',
  },
  modifiedOn: {
    S: '2022-03-08T08:00:00.000Z',
  },
  startDate: {
    S: '2022-03-08T22:00:00.000Z',
  },
  endDate: {
    S: '2099-03-15T06:59:00.000Z',
  },
  addOnFlagOne: {
    S: 'enrollment',
  },
  addOnFlagTwo: {
    S: '',
  },
  addOnFlagThree: {
    S: '',
  },
};

export const MOCK_CAMPAIGN_RAW_NO_CAMPAIGN = {
  pKey: {
    N: '1',
  },
  version: {
    N: '0',
  },
  campaign: {
    S: 'NO_CAMPAIGN',
  },
  currentVersion: {
    N: '1',
  },
  denomination: {
    N: '0',
  },
  bonusAmount: {
    N: '0',
  },
  bonusThreshold: {
    N: '9999',
  },
  maxReferrals: {
    N: '10',
  },
  addOnFlagOne: {
    S: '',
  },
  addOnFlagTwo: {
    S: '',
  },
  addOnFlagThree: {
    S: '',
  },
  startDate: {
    S: '9999-12-01T00:00:00.000Z',
  },
  endDate: {
    S: '9999-12-01T00:00:00.000Z',
  },
  createdOn: {
    S: '2022-01-19T20:48:30.862Z',
  },
  modifiedOn: {
    S: '2022-01-19T20:48:30.862Z',
  },
};

export const MOCK_MODIFY_ACTIVE_TO_ACTIVE = {
  dynamodb: {
    OldImage: MOCK_CAMPAIGN_RAW_ACTIVE,
    NewImage: MOCK_CAMPAIGN_RAW_ACTIVE,
  },
  eventName: 'MODIFY',
} as DynamoDBRecord;

export const MOCK_MODIFY_ACTIVE_TO_INACTIVE = {
  dynamodb: {
    OldImage: MOCK_CAMPAIGN_RAW_ACTIVE,
    NewImage: MOCK_CAMPAIGN_RAW_NO_CAMPAIGN,
  },
  eventName: 'MODIFY',
} as DynamoDBRecord;

export const MOCK_MODIFY_INACTIVE_TO_ACTIVE = {
  dynamodb: {
    OldImage: MOCK_CAMPAIGN_RAW_NO_CAMPAIGN,
    NewImage: MOCK_CAMPAIGN_RAW_ACTIVE,
  },
  eventName: 'MODIFY',
} as DynamoDBRecord;

export const MOCK_CAMPAIGN_ACTIVE = {
  pKey: 1,
  version: 0,
  campaign: 'mar20XX',
  currentVersion: 2,
  denomination: 5,
  bonusAmount: 5,
  bonusThreshold: 10,
  maxReferrals: 10,
  addOnFlagOne: 'enrollment',
  addOnFlagTwo: '',
  addOnFlagThree: '',
  startDate: '2021-01-01T08:00:00.000Z',
  endDate: '2099-12-31T06:59:00.000Z',
  createdOn: '2022-01-01T08:00:00.000Z',
  modifiedOn: '2022-01-01T08:00:00.000Z',
};

export const MOCK_CAMPAIGN_ENDED = {
  ...MOCK_CAMPAIGN_ACTIVE,
  endDate: dayjs(new Date()).add(-7, 'd').toISOString(),
};

export const MOCK_CAMPAIGN_NO_CAMPAIGN = {
  pKey: 1,
  version: 0,
  campaign: 'NO_CAMPAIGN',
  currentVersion: 1,
  denomination: 0,
  bonusAmount: 0,
  bonusThreshold: 9999,
  maxReferrals: 10,
  addOnFlagOne: '',
  addOnFlagTwo: '',
  addOnFlagThree: '',
  startDate: '9999-12-01T00:00:00.000Z',
  endDate: '9999-12-01T00:00:00.000Z',
  createdOn: '2022-01-19T20:48:30.862Z',
  modifiedOn: '2022-01-19T20:48:30.862Z',
};
