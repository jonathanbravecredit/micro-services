import { SNS, CognitoIdentityServiceProvider } from 'aws-sdk';
import { DynamoDBStreamEvent } from 'aws-lambda';
import { InitiativeProgramTagsRunner } from 'libs/utils/runners/InitiativeProgramTagsRunner';
import { main } from 'src/triggers/triggerInitiativeProgramMarketing';
import { mocked } from 'ts-jest/utils';

// jest.mock('src/triggers/triggerInitiativeProgramMarketing');
const mockPublish = jest.fn().mockReturnValue(null);
jest.mock('libs/utils/runners/InitiativeProgramTagsRunner', () => {
  return {
    InitiativeProgramTagsRunner: jest.fn().mockImplementation(() => {
      return {
        publish: mockPublish,
      };
    }),
  };
});

describe('InitiativeProgram marketing tags', () => {
  const arg = null as any;
  const mockedRunner = mocked(new InitiativeProgramTagsRunner(arg, arg, arg, arg, arg));
  // const mockedMain = mocked(main);
  beforeEach(() => {
    mockedRunner.publish.mockClear();
  });
  it('should run the tags runner if INSERT or MODIFY event', async () => {
    const event = { Records: [{ eventName: 'INSERT' }, { eventName: 'MODIFY' }] } as DynamoDBStreamEvent;
    await main(event, arg, arg);
    expect(mockedRunner.publish).toHaveBeenCalledTimes(2);
  });
  it('should NOT run the tags runner if NOT INSERT or MODIFY event', async () => {
    const event = { Records: [{ eventName: 'REMOVE' }, { eventName: 'REMOVE' }] } as DynamoDBStreamEvent;
    await main(event, arg, arg);
    expect(mockedRunner.publish).not.toHaveBeenCalled();
  });
});
