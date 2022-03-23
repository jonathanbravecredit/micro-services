import { DynamoDB } from 'aws-sdk';
import { Helper } from 'tests/helpers/test-helper';
import GetSuspendedAccount from 'libs/classes/suspendedaccounts/getsuspendedaccount';

describe('GetSuspendedAccount class', () => {
  const mockPromise = jest.fn().mockReturnValue({});
  const mockQuery = jest.fn().mockImplementation((param: DynamoDB.DocumentClient.QueryInput) => ({
    promise: mockPromise,
  }));
  const client = {
    query: mockQuery,
  } as unknown as DynamoDB.DocumentClient;
  const params = {} as DynamoDB.DocumentClient.QueryInput;
  const getAccount = new GetSuspendedAccount(client, params);
  const h = new Helper<GetSuspendedAccount>(getAccount);
  it('should contain execute method', () => {
    const test = h.hasMethod(getAccount, 'execute');
    expect(test).toEqual(true);
  });
  it('should contain handleCommonErrors method', () => {
    const test = h.hasMethod(getAccount, 'handleCommonErrors');
    expect(test).toEqual(true);
  });
  it('should contain handleQueryError method', () => {
    const test = h.hasMethod(getAccount, 'handleQueryError');
    expect(test).toEqual(true);
  });
  it('should contain output property', () => {
    const test = h.hasProperty(getAccount, 'output');
    expect(test).toEqual(true);
  });
  it('should contain client property', () => {
    const test = h.hasProperty(getAccount, 'client');
    expect(test).toEqual(true);
  });
  it('should contain params property', () => {
    const test = h.hasProperty(getAccount, 'params');
    expect(test).toEqual(true);
  });
  it('should default output to null', () => {
    expect(getAccount.output).toBeNull();
  });

  describe('execute method', () => {
    it('should call client.query 1 time when no results', async () => {
      await getAccount.execute();
      const spy = jest.spyOn(client, 'query');
      expect(spy).toHaveBeenCalledTimes(1);
      expect(getAccount.params.ExclusiveStartKey).toBeUndefined();
    });
    it('should call handleQueryError when error thrown', async () => {
      const mockPromise = jest.fn().mockImplementation(() => {
        throw 'I am an error';
      });
      const mockQuery = jest.fn().mockImplementation((param: DynamoDB.DocumentClient.QueryInput) => ({
        promise: mockPromise,
      }));
      const client = {
        query: mockQuery,
      } as unknown as DynamoDB.DocumentClient;
      const getAccount3 = new GetSuspendedAccount(client, params);
      const spy = jest.spyOn(getAccount3, 'handleQueryError');
      await getAccount3.execute();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('I am an error');
    });
    it('should set the output to the Items returned from client', async () => {
      const mockQueryOutput = { Items: [{ id: 'abc' }] };
      const mockPromise = jest.fn().mockReturnValueOnce(mockQueryOutput);
      const mockQuery = jest.fn().mockImplementation((param: DynamoDB.DocumentClient.QueryInput) => ({
        promise: mockPromise,
      }));
      const client = {
        query: mockQuery,
      } as unknown as DynamoDB.DocumentClient;
      const getAccount4 = new GetSuspendedAccount(client, params);
      await getAccount4.execute();
      expect(getAccount4.output).toEqual({ id: 'abc' });
    });
    it('should set the output to null if nothing found', async () => {
      const mockQueryOutput = { Items: [] };
      const mockPromise = jest.fn().mockReturnValueOnce(mockQueryOutput);
      const mockQuery = jest.fn().mockImplementation((param: DynamoDB.DocumentClient.QueryInput) => ({
        promise: mockPromise,
      }));
      const client = {
        query: mockQuery,
      } as unknown as DynamoDB.DocumentClient;
      const getAccount4 = new GetSuspendedAccount(client, params);
      await getAccount4.execute();
      expect(getAccount4.output).toBeNull();
    });
  });
});
