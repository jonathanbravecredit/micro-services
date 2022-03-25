import { DynamoDBRecord } from 'aws-lambda';
import { Referral } from 'libs/models/referrals/referral.model';

export const MOCK = {
  id: {
    S: 'bac',
  },
  campaignActive: {
    S: 'mar2022',
  },
  totalBonus: {
    N: '0',
  },
  campaignActiveAddOn: {
    N: '5',
  },
  suspended: {
    BOOL: false,
  },
  campaignActiveEarned: {
    N: '0',
  },
  campaignActiveReferred: {
    N: '0',
  },
  totalEarned: {
    N: '0',
  },
  campaignActiveBonus: {
    N: '0',
  },
  nextPaymentDate: {
    S: '2022-04-05T08:00:00.000Z',
  },
  campaignActivePaid: {
    N: '0',
  },
  totalAddOn: {
    N: '5',
  },
  campaignPriorEarned: {
    N: '0',
  },
  enrolled: {
    BOOL: true,
  },
  notified: {
    BOOL: false,
  },
  campaignPriorPaid: {
    N: '0',
  },
  eligible: {
    N: '1',
  },
  campaignPriorAddOn: {
    N: '0',
  },
  referredById: {
    S: 'xyz',
  },
  referralCode: {
    S: 'code_abc',
  },
  campaignPriorBonus: {
    N: '0',
  },
  campaignPrior: {
    S: '',
  },
  campaignPriorReferred: {
    N: '0',
  },
  totalReferred: {
    N: '0',
  },
  createdOn: {
    S: '2022-03-13T17:22:57.463Z',
  },
  modifiedOn: {
    S: '2022-03-13T17:27:09.546Z',
  },
  referredByCode: {
    S: 'code_xyz',
  },
};

export const MOCK_UNENROLLED = {
  id: {
    S: 'bac',
  },
  campaignActive: {
    S: 'mar2022',
  },
  totalBonus: {
    N: '0',
  },
  campaignActiveAddOn: {
    N: '0',
  },
  suspended: {
    BOOL: false,
  },
  campaignActiveEarned: {
    N: '0',
  },
  campaignActiveReferred: {
    N: '0',
  },
  totalEarned: {
    N: '0',
  },
  campaignActiveBonus: {
    N: '0',
  },
  nextPaymentDate: {
    S: '2022-04-05T08:00:00.000Z',
  },
  campaignActivePaid: {
    N: '0',
  },
  totalAddOn: {
    N: '5',
  },
  campaignPriorEarned: {
    N: '0',
  },
  enrolled: {
    BOOL: false,
  },
  notified: {
    BOOL: false,
  },
  campaignPriorPaid: {
    N: '0',
  },
  eligible: {
    N: '1',
  },
  campaignPriorAddOn: {
    N: '0',
  },
  referredById: {
    S: 'xyz',
  },
  referralCode: {
    S: 'code_abc',
  },
  campaignPriorBonus: {
    N: '0',
  },
  campaignPrior: {
    S: '',
  },
  campaignPriorReferred: {
    N: '0',
  },
  totalReferred: {
    N: '0',
  },
  createdOn: {
    S: '2022-03-13T17:22:57.463Z',
  },
  modifiedOn: {
    S: '2022-03-13T17:27:09.546Z',
  },
  referredByCode: {
    S: 'code_xyz',
  },
};

export const MOCK_NO_REFERRED_BY = {
  id: {
    S: 'bac',
  },
  campaignActive: {
    S: 'mar2022',
  },
  totalBonus: {
    N: '0',
  },
  campaignActiveAddOn: {
    N: '0',
  },
  suspended: {
    BOOL: false,
  },
  campaignActiveEarned: {
    N: '0',
  },
  campaignActiveReferred: {
    N: '0',
  },
  totalEarned: {
    N: '0',
  },
  campaignActiveBonus: {
    N: '0',
  },
  nextPaymentDate: {
    S: '2022-04-05T08:00:00.000Z',
  },
  campaignActivePaid: {
    N: '0',
  },
  totalAddOn: {
    N: '5',
  },
  campaignPriorEarned: {
    N: '0',
  },
  enrolled: {
    BOOL: false,
  },
  notified: {
    BOOL: false,
  },
  campaignPriorPaid: {
    N: '0',
  },
  eligible: {
    N: '1',
  },
  campaignPriorAddOn: {
    N: '0',
  },
  referredById: {
    NULL: true,
  },
  referralCode: {
    S: 'code_abc',
  },
  campaignPriorBonus: {
    N: '0',
  },
  campaignPrior: {
    S: '',
  },
  campaignPriorReferred: {
    N: '0',
  },
  totalReferred: {
    N: '0',
  },
  createdOn: {
    S: '2022-03-13T17:22:57.463Z',
  },
  modifiedOn: {
    S: '2022-03-13T17:27:09.546Z',
  },
  referredByCode: {
    NULL: true,
  },
};

export const MOCK_SUSPENDED = {
  id: {
    S: 'bac',
  },
  campaignActive: {
    S: 'mar2022',
  },
  totalBonus: {
    N: '0',
  },
  campaignActiveAddOn: {
    N: '5',
  },
  suspended: {
    BOOL: true,
  },
  campaignActiveEarned: {
    N: '0',
  },
  campaignActiveReferred: {
    N: '0',
  },
  totalEarned: {
    N: '0',
  },
  campaignActiveBonus: {
    N: '0',
  },
  nextPaymentDate: {
    S: '2022-04-05T08:00:00.000Z',
  },
  campaignActivePaid: {
    N: '0',
  },
  totalAddOn: {
    N: '5',
  },
  campaignPriorEarned: {
    N: '0',
  },
  enrolled: {
    BOOL: true,
  },
  notified: {
    BOOL: false,
  },
  campaignPriorPaid: {
    N: '0',
  },
  eligible: {
    N: '1',
  },
  campaignPriorAddOn: {
    N: '0',
  },
  referredById: {
    S: 'xyz',
  },
  referralCode: {
    S: 'code_abc',
  },
  campaignPriorBonus: {
    N: '0',
  },
  campaignPrior: {
    S: '',
  },
  campaignPriorReferred: {
    N: '0',
  },
  totalReferred: {
    N: '0',
  },
  createdOn: {
    S: '2022-03-13T17:22:57.463Z',
  },
  modifiedOn: {
    S: '2022-03-13T17:27:09.546Z',
  },
  referredByCode: {
    S: 'code_xyz',
  },
};

export const MOCK_INSERT = {
  dynamodb: {
    NewImage: MOCK,
  },
  eventName: 'INSERT',
} as DynamoDBRecord;

export const MOCK_MODIFY = {
  dynamodb: {
    OldImage: MOCK,
    NewImage: MOCK,
  },
  eventName: 'MODIFY',
} as DynamoDBRecord;

export const MOCK_ACTIVE_TO_SUSPENDED = {
  dynamodb: {
    OldImage: MOCK,
    NewImage: MOCK_SUSPENDED,
  },
  eventName: 'MODIFY',
} as DynamoDBRecord;

export const MOCK_SUSPENDED_TO_SUSPENDED = {
  dynamodb: {
    OldImage: MOCK_SUSPENDED,
    NewImage: MOCK_SUSPENDED,
  },
  eventName: 'MODIFY',
} as DynamoDBRecord;

export const MOCK_SUSPENDED_INSERT = {
  dynamodb: {
    NewImage: MOCK_SUSPENDED,
  },
  eventName: 'INSERT',
} as DynamoDBRecord;

export const MOCK_UNENROLLED_TO_ENROLLED_MODIFY = {
  dynamodb: {
    OldImage: MOCK_UNENROLLED,
    NewImage: MOCK,
  },
  eventName: 'MODIFY',
} as DynamoDBRecord;

export const MOCK_ENROLLED_MODIFY = {
  dynamodb: {
    OldImage: MOCK,
    NewImage: MOCK,
  },
  eventName: 'MODIFY',
} as DynamoDBRecord;

export const MOCK_UNENROLLED_MODIFY = {
  dynamodb: {
    OldImage: MOCK_UNENROLLED,
    NewImage: MOCK_UNENROLLED,
  },
  eventName: 'MODIFY',
} as DynamoDBRecord;

export const MOCK_NOTREFERRED_MODIFY = {
  dynamodb: {
    OldImage: MOCK_NO_REFERRED_BY,
    NewImage: MOCK_NO_REFERRED_BY,
  },
  eventName: 'MODIFY',
} as DynamoDBRecord;

export const MOCK_UNMARSHALLED = {
  id: 'xyz',
  campaignActive: 'mar2022',
  totalBonus: 0,
  campaignActiveAddOn: 0,
  suspended: false,
  campaignActiveEarned: 0,
  campaignActiveReferred: 0,
  totalEarned: 0,
  campaignActiveBonus: 0,
  nextPaymentDate: '2022-04-05T08:00:00.000Z',
  campaignActivePaid: 0,
  totalAddOn: 0,
  campaignPriorEarned: 0,
  enrolled: true,
  notified: false,
  campaignPriorPaid: 0,
  eligible: 1,
  campaignPriorAddOn: 0,
  referredById: '664fa7d4-2a97-4bd8-8665-7c84f1068114',
  referralCode: 'ac50c1cc-f74b-447e-90ef-3dbae9cd4395',
  campaignPriorBonus: 0,
  campaignPrior: '',
  campaignPriorReferred: 0,
  totalReferred: 0,
  createdOn: '2022-03-13T17:22:57.463Z',
  modifiedOn: '2022-03-13T17:27:09.546Z',
  referredByCode: 'dd139a72-9152-44e3-aeb7-c487fcff49e3',
} as Referral;
