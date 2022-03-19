import { mocked } from 'ts-jest/utils';
import { DynamoDB } from 'aws-sdk';
import { GetSuspendedAccounts } from 'libs/classes/suspendedaccounts/getsuspendedaccounts';
import { getSuspendedAccounts } from 'libs/queries/suspendedaccounts/list.query';

const mockExecute = jest.fn();
jest.mock('../../../libs/classes/suspendedaccounts/getsuspendedaccounts', () => {
  return {
    GetSuspendedAccounts: jest.fn().mockImplementation(() => {
      return {
        execute: mockExecute,
        output: [],
      };
    }),
  };
});

describe('getSuspendedAccounts query', () => {
  const client = {} as DynamoDB.DocumentClient;
  const params = {} as DynamoDB.DocumentClient.QueryInput;
  const mockedClass = mocked(new GetSuspendedAccounts(client, params));

  beforeEach(() => {
    mockedClass.execute.mockClear();
  });

  it('should call execute on the class', async () => {
    await getSuspendedAccounts();
    expect(mockedClass.execute).toHaveBeenCalled();
  });
  it('should output the default', async () => {
    const test = [];
    const res = await getSuspendedAccounts();
    expect(res).toEqual(test);
  });
});
