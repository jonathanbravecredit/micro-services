import dayjs from 'dayjs';

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
