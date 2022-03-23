import { DynamoDBRecord } from 'aws-lambda';
import { SNS, CognitoIdentityServiceProvider } from 'aws-sdk';
import { InitiativeCheck } from 'libs/utils/mailchimp/checkers/checks/initiatives/InitiativeCheck';
import { CognitoUtil } from 'libs/utils/cognito/cognito';
import { Mailchimp } from 'libs/utils/mailchimp/mailchimp';
import { MailchimpTriggerEmails } from 'libs/utils/mailchimp/constants';
import { DBStreamRunner } from 'libs/utils/runners/base/dbStreamRunner';
import { InitiativeProgramTagsRunner } from 'libs/utils/runners/InitiativeProgramTagsRunner';
import { Helper } from 'tests/helpers/test-helper';
import { mocked } from 'ts-jest/utils';
import { BUY_HOUSE_MOCK, CC_MOCK } from 'tests/mocks/initiative.mocks';

interface MockInterface {
  id: string;
  program: number;
  initiative: string;
}
const mockCheckOne = jest.fn().mockReturnValue({ valid: true, data: {} });
const mockCheckTwo = jest.fn().mockReturnValue({ valid: true, data: {} });
const mockCheckThr = jest.fn().mockReturnValue({ valid: true, data: {} });
const mockGetUser = jest.fn().mockReturnValue('sample@test.com');
jest.mock('libs/utils/mailchimp/checkers/checks/initiatives/InitiativeCheck', () => {
  return {
    InitiativeCheck: jest.fn().mockImplementation(() => {
      return {
        checkOne: mockCheckOne,
        checkTwo: mockCheckTwo,
        checkThree: mockCheckThr,
      };
    }),
  };
});

jest.mock('libs/utils/cognito/cognito', () => {
  return {
    CognitoUtil: jest.fn().mockImplementation(() => {
      return {
        email: 'sample@test.com',
        getUserBySub: mockGetUser,
      };
    }),
  };
});

jest.mock('libs/utils/mailchimp/mailchimp');

describe('InitiativeProgramTagsRunner', () => {
  const mockPromise = jest.fn().mockReturnValue({});
  const mockPublish = jest.fn().mockImplementation((param: SNS.PublishInput) => ({
    promise: mockPromise,
  }));
  const mockSNS = {
    publish: mockPublish,
  } as unknown as SNS;
  const mockRecord: DynamoDBRecord = {
    dynamodb: {
      OldImage: BUY_HOUSE_MOCK,
      NewImage: BUY_HOUSE_MOCK,
    },
  } as DynamoDBRecord;
  const mockRecordCC: DynamoDBRecord = {
    dynamodb: {
      OldImage: CC_MOCK,
      NewImage: CC_MOCK,
    },
  } as DynamoDBRecord;
  const mockProvider = {} as CognitoIdentityServiceProvider;
  let modRunner = new InitiativeProgramTagsRunner('MODIFY', mockRecord, 'pool');
  // const insRunner = new InitiativeProgramTagsRunner('INSERT', mockRecord, mockSNS);
  let modh = new Helper<InitiativeProgramTagsRunner>(modRunner);
  const { priorImage: p, currImage: c, event: e } = modRunner;
  const mockedCheckClass = mocked(new InitiativeCheck(e, c, p));
  const mockedCogClass = mocked(new CognitoUtil('pool'));
  const mockedMailchimp = mocked(Mailchimp);
  beforeEach(() => {
    mockedCheckClass.checkOne.mockClear();
    mockedCheckClass.checkTwo.mockClear();
    mockedCheckClass.checkThree.mockClear();
    mockedCogClass.getUserBySub.mockClear();
    mockedMailchimp.createMailMessage.mockClear();
    mockedMailchimp.createSNSPayload.mockClear();
  });
  afterEach(() => {
    // rest the runners
    modRunner = new InitiativeProgramTagsRunner('MODIFY', mockRecord, 'pool');
    modh = new Helper<InitiativeProgramTagsRunner>(modRunner);
  });
  describe('Inherited methods and props', () => {
    it('should contain init method', () => {
      const test = modh.hasMethod(modRunner, 'init');
      expect(test).toEqual(true);
    });
    it('should contain parseImages method', () => {
      const test = modh.hasMethod(modRunner, 'parseImages');
      expect(test).toEqual(true);
    });
    it('should contain unmarshall method', () => {
      const test = modh.hasMethod(modRunner, 'unmarshall');
      expect(test).toEqual(true);
    });
    it('should contain currImage property', () => {
      const test = modh.hasProperty(modRunner, 'currImage');
      expect(test).toEqual(true);
    });
    it('should contain priorImage property', () => {
      const test = modh.hasProperty(modRunner, 'priorImage');
      expect(test).toEqual(true);
    });
  });

  describe('runner methods and props', () => {
    it('should contain a init method', () => {
      const test = modh.hasMethod(modRunner, 'init');
      expect(test).toEqual(true);
    });
    it('should contain a getEmail method', () => {
      const test = modh.hasMethod(modRunner, 'getEmail');
      expect(test).toEqual(true);
    });
    it('should contain a getPackets method', () => {
      const test = modh.hasMethod(modRunner, 'getPackets');
      expect(test).toEqual(true);
    });
    it('should contain a publish method', () => {
      const test = modh.hasMethod(modRunner, 'publish');
      expect(test).toEqual(true);
    });
    it('should contain a packets property', () => {
      const test = modh.hasProperty(modRunner, 'packets');
      expect(test).toEqual(true);
    });
    it('should contain a email property', () => {
      const test = modh.hasProperty(modRunner, 'email');
      expect(test).toEqual(true);
    });
    it('should contain a sns property', () => {
      const test = modh.hasProperty(modRunner, 'sns');
      expect(test).toEqual(true);
    });
    it('should contain a triggerLibrary property with default', () => {
      const test = modh.hasProperty(modRunner, 'triggerLibrary');
      const mockLibrary = {
        [MailchimpTriggerEmails.GoalChosen]: mockedCheckClass.checkOne,
        [MailchimpTriggerEmails.GoalTaskStatus]: mockedCheckClass.checkTwo,
        [MailchimpTriggerEmails.GoalProgress]: mockedCheckClass.checkThree,
      };
      expect(test).toEqual(true);
      expect(Object.keys(modRunner.triggerLibrary)).toMatchObject(Object.keys(mockLibrary));
    });
  });

  describe('init method', () => {
    it('should call the DBStreamRunner init method', () => {
      const spy = jest.spyOn(DBStreamRunner.prototype, 'init');
      modRunner.init();
      expect(spy).toHaveBeenCalled();
    });
    it('should call the getPackets method', () => {
      const spy = jest.spyOn(modRunner, 'getPackets');
      modRunner.init();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('getEmail method', () => {
    it('should call cognito.getUserBySub method', async () => {
      await modRunner.getEmail();
      expect(mockedCogClass.getUserBySub).toHaveBeenCalled();
    });
    it('should call set the email prop method', async () => {
      await modRunner.getEmail();
      expect(modRunner.email).toEqual('sample@test.com');
    });
  });

  describe('getPackets method', () => {
    it('should call the InitiativeCheck methods', () => {
      modRunner.getPackets();
      expect(mockedCheckClass.checkOne).toHaveBeenCalledTimes(1);
      expect(mockedCheckClass.checkTwo).toHaveBeenCalledTimes(1);
      expect(mockedCheckClass.checkThree).toHaveBeenCalledTimes(1);
    });
  });

  describe('publish method', () => {
    it('should return undefined', async () => {
      const res = await modRunner.publish();
      expect(res).toBeUndefined();
    });

    it('should should call mailchimp methods', async () => {
      modRunner.packets = [{ data: { api: 'marketing' }, template: 'some_template' }];
      await modRunner.publish();
      expect(mockedMailchimp.createMailMessage).toHaveBeenCalled();
      expect(mockedMailchimp.createSNSPayload).toHaveBeenCalled();
    });

    it('should call sns.publish', async () => {
      modRunner.packets = [{ data: { api: 'marketing' }, template: 'some_template' }];
      const spy = jest.spyOn(modRunner.sns, 'publish');
      await modRunner.publish();
      expect(spy).toHaveBeenCalled();
      spy.mockClear();
    });

    it('should NOT call mailchimp methods nor sns if not a marketing packet', async () => {
      modRunner.packets = [{ data: { api: 'not_marketing' as 'marketing' }, template: 'some_template' }];
      const spy = jest.spyOn(modRunner.sns, 'publish');
      await modRunner.publish();
      expect(mockedMailchimp.createMailMessage).not.toHaveBeenCalled();
      expect(mockedMailchimp.createSNSPayload).not.toHaveBeenCalled();
      expect(spy).not.toHaveBeenCalled();
    });
  });
});
