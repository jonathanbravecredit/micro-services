import { DynamoDB } from 'aws-sdk';
import { Helper } from 'tests/helpers/test-helper';
import UpdateSuspendedAccount from 'libs/classes/suspendedaccounts/updatesuspendedaccount';

describe('UpdateSuspendedAccount class', () => {
  const mockPromise = jest.fn().mockReturnValue({});
  const mockUpdate = jest.fn().mockImplementation((param: DynamoDB.DocumentClient.QueryInput) => ({
    promise: mockPromise,
  }));
  const client = {
    update: mockUpdate,
  } as unknown as DynamoDB.DocumentClient;
  const params = {} as DynamoDB.DocumentClient.UpdateItemInput;
  const updateAccount = new UpdateSuspendedAccount(client, params);
  const h = new Helper<UpdateSuspendedAccount>(updateAccount);
  it('should contain execute method', () => {
    const test = h.hasMethod(updateAccount, 'execute');
    expect(test).toEqual(true);
  });
  it('should contain handleCommonErrors method', () => {
    const test = h.hasMethod(updateAccount, 'handleCommonErrors');
    expect(test).toEqual(true);
  });
  it('should contain handleQueryError method', () => {
    const test = h.hasMethod(updateAccount, 'handleQueryError');
    expect(test).toEqual(true);
  });
  it('should contain output property', () => {
    const test = h.hasProperty(updateAccount, 'output');
    expect(test).toEqual(true);
  });
  it('should contain client property', () => {
    const test = h.hasProperty(updateAccount, 'client');
    expect(test).toEqual(true);
  });
  it('should contain params property', () => {
    const test = h.hasProperty(updateAccount, 'params');
    expect(test).toEqual(true);
  });
  it('should default output to an empty an object', () => {
    expect(updateAccount.output).toEqual({});
  });

  describe('execute method', () => {
    it('should call client.update 1', async () => {
      await updateAccount.execute();
      const spy = jest.spyOn(client, 'update');
      expect(spy).toHaveBeenCalledTimes(1);
    });
    it('should call handleQueryError when error thrown', async () => {
      const mockPromise = jest.fn().mockImplementation(() => {
        throw 'I am an error';
      });
      const mockUpdate = jest.fn().mockImplementation((param: DynamoDB.DocumentClient.QueryInput) => ({
        promise: mockPromise,
      }));
      const client = {
        update: mockUpdate,
      } as unknown as DynamoDB.DocumentClient;
      const updateAccount2 = new UpdateSuspendedAccount(client, params);
      const spy = jest.spyOn(updateAccount2, 'handleQueryError');
      await updateAccount2.execute();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('I am an error');
    });
    it('should set the output to the Items returned from client', async () => {
      const mockPromise = jest.fn().mockReturnValueOnce(['return values']);
      const mockUpdate = jest.fn().mockImplementation((param: DynamoDB.DocumentClient.QueryInput) => ({
        promise: mockPromise,
      }));
      const client = {
        update: mockUpdate,
      } as unknown as DynamoDB.DocumentClient;
      const getAccounts4 = new UpdateSuspendedAccount(client, params);
      await getAccounts4.execute();
      expect(getAccounts4.output).toEqual(['return values']);
    });
  });
});
