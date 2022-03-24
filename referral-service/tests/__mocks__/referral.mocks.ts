import { DynamoDBRecord } from 'aws-lambda';

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
