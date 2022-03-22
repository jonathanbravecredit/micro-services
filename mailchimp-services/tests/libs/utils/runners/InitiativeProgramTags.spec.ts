import { DynamoDBRecord } from 'aws-lambda';
import { SNS } from 'aws-sdk';
import { InitiativeCheck } from 'libs/utils/mailchimp/checkers/checks/initiatives/InitiativeCheck';
import { MailchimpTriggerEmails } from 'libs/utils/mailchimp/constants';
import { InitiativeProgramTagsRunner } from 'libs/utils/runners/InitiativeProgramTagsRunner';
import { Helper } from 'tests/helpers/test-helper';

interface MockInterface {
  id: string;
  program: number;
  initiative: string;
}

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
      OldImage: {
        id: {
          S: 'abc',
        },
        program: {
          N: '1',
        },
        initiative: {
          S: 'original value',
        },
      },
      NewImage: {
        id: {
          S: 'abc',
        },
        program: {
          N: '1',
        },
        initiative: {
          S: 'new value',
        },
      },
    },
  } as DynamoDBRecord;
  const modRunner = new InitiativeProgramTagsRunner('MODIFY', mockRecord, mockSNS);
  // const insRunner = new InitiativeProgramTagsRunner('INSERT', mockRecord, mockSNS);
  const modh = new Helper<InitiativeProgramTagsRunner>(modRunner);

  afterEach(() => {});
  describe('Inheritied methods and props', () => {
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
    it('should contain a resolver method', () => {
      const test = modh.hasMethod(modRunner, 'resolver');
      expect(test).toEqual(true);
    });
    it('should contain a publish method', () => {
      const test = modh.hasMethod(modRunner, 'publish');
      expect(test).toEqual(true);
    });
    it('should contain a checker property', () => {
      const test = modh.hasProperty(modRunner, 'checker');
      const { event, currImage, priorImage } = modRunner;
      const mockChecker = new InitiativeCheck(event, currImage, priorImage);
      expect(test).toEqual(true);
      expect(modRunner.checker).toEqual(mockChecker);
    });
    it('should contain a triggers property with default', () => {
      const test = modh.hasProperty(modRunner, 'triggers');
      expect(test).toEqual(true);
      expect(modRunner.triggers).toEqual([]);
    });
    it('should contain a triggerLibrary property with default', () => {
      const test = modh.hasProperty(modRunner, 'triggerLibrary');
      const { event, currImage, priorImage } = modRunner;
      const mockChecker = new InitiativeCheck(event, currImage, priorImage);
      const mockLibrary = {
        [MailchimpTriggerEmails.GoalChosen]: () => mockChecker.checkOne(),
        [MailchimpTriggerEmails.GoalTaskStatus]: () => mockChecker.checkTwo(),
        [MailchimpTriggerEmails.GoalProgress]: () => mockChecker.checkThree(),
      };
      expect(test).toEqual(true);
      expect(modRunner.triggerLibrary).toEqual(mockLibrary);
    });
  });

  xdescribe('init method', () => {});

  xdescribe('resolver method', () => {});

  describe('publish method', () => {
    it('should return undefined', async () => {
      const res = await modRunner.publish();
      expect(res).toBeUndefined();
    });
  });
});
