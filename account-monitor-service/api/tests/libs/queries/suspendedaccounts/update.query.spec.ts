import { mocked } from 'ts-jest/utils';
import { DynamoDB } from 'aws-sdk';
import { UpdateSuspendedAccount } from 'libs/classes/suspendedaccounts/updatesuspendedaccount';
import { updateSuspendedAccount } from 'libs/queries/suspendedaccounts/update.query';

const mockExecute = jest.fn();
jest.mock('../../../libs/classes/suspendedaccounts/updatesuspendedaccount', () => {
  return {
    UpdateSuspendedAccount: jest.fn().mockImplementation(() => {
      return {
        execute: mockExecute,
        output: [],
      };
    }),
  };
});

describe('updateSuspendedAccount query', () => {
  const client = {} as DynamoDB.DocumentClient;
  const params = {} as DynamoDB.DocumentClient.UpdateItemInput;
  const mockedClass = mocked(new UpdateSuspendedAccount(client, params));

  beforeEach(() => {
    mockedClass.execute.mockClear();
  });

  it('should call execute on the class', async () => {
    await updateSuspendedAccount('abc');
    expect(mockedClass.execute).toHaveBeenCalled();
  });
  it('should output the default', async () => {
    const test = [];
    const res = await updateSuspendedAccount('abc');
    expect(res).toEqual(test);
  });
});
