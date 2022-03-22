import { DynamoDBRecord } from 'aws-lambda';
import { SNS } from 'aws-sdk';
import { UserInitiative } from 'libs/models/UserInitiative.model';
import { IMailchimpPacket, IMarketingData } from 'libs/utils/mailchimp/interfaces';
import { TriggerInitiativeProgramTagsRunner } from 'libs/utils/runners/triggerInitiativeProgramTags';
import { Helper } from 'tests/helpers/test-helper';

interface MockInterface {
  pKey: string;
  sKey: number;
  value: string;
}

describe('TriggerInitiativeProgramTagsRunner', () => {
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
        pKey: {
          S: 'abc',
        },
        sKey: {
          N: '1',
        },
        value: {
          S: 'original value',
        },
      },
      NewImage: {
        pKey: {
          S: 'abc',
        },
        sKey: {
          N: '1',
        },
        value: {
          S: 'new value',
        },
      },
    },
  } as DynamoDBRecord;
  const runner = new TriggerInitiativeProgramTagsRunner(mockRecord, mockSNS);
  const h = new Helper<TriggerInitiativeProgramTagsRunner>(runner);

  afterEach(() => {});
  describe('Inheritied methods and props', () => {
    it('should contain init method', () => {
      const test = h.hasMethod(runner, 'init');
      expect(test).toEqual(true);
    });
    it('should contain parseImages method', () => {
      const test = h.hasMethod(runner, 'parseImages');
      expect(test).toEqual(true);
    });
    it('should contain unmarshall method', () => {
      const test = h.hasMethod(runner, 'unmarshall');
      expect(test).toEqual(true);
    });
    it('should contain currImage property', () => {
      const test = h.hasProperty(runner, 'currImage');
      expect(test).toEqual(true);
    });
    it('should contain priorImage property', () => {
      const test = h.hasProperty(runner, 'priorImage');
      expect(test).toEqual(true);
    });
  });

  describe('runner methods and props', () => {
    it('should contain a resolver property', () => {
      const test = h.hasProperty(runner, 'resolver');
      expect(test).toEqual(true);
    });
    it('should contain a triggers property that defaults', () => {
      const test = h.hasProperty(runner, 'triggers');
      expect(test).toEqual(true);
      expect(runner.triggers).toEqual([]);
    });
    it('should contain a resolve method', () => {
      const test = h.hasMethod(runner, 'resolve');
      expect(test).toEqual(true);
    });
    it('should contain a publish method', () => {
      const test = h.hasMethod(runner, 'publish');
      expect(test).toEqual(true);
    });
  });

  describe('resolve method', () => {
    it('should call resolver', () => {
      const spy = jest.spyOn(runner, 'resolver');
      runner.resolve(null, {} as UserInitiative, 'MODIFY');
      expect(spy).toHaveBeenCalled();
    });
    it('should set the triggers property with output of the resolver', () => {
      const value = ['abc'];
      jest.spyOn(runner, 'resolver').mockReturnValue(value as unknown as IMailchimpPacket<IMarketingData>[]);
      runner.resolve(null, {} as UserInitiative, 'MODIFY');
      expect(runner.triggers).toEqual(value);
    });
  });

  describe('publish method', () => {
    it('should return undefined', async () => {
      const res = await runner.publish();
      expect(res).toBeUndefined();
    });
  });
});
