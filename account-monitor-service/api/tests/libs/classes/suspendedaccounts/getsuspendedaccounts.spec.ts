import { DynamoDB } from 'aws-sdk';
import { Helper } from 'tests/helpers/test-helper';
import GetSuspendedAccounts from 'libs/classes/suspendedaccounts/getsuspendedaccounts';

describe('GetSuspendedAccounts class', () => {
  const mockPromise = jest.fn().mockReturnValue({});
  const mockQuery = jest.fn().mockImplementation((param: DynamoDB.DocumentClient.QueryInput) => ({
    promise: mockPromise,
  }));
  const client = {
    query: mockQuery,
  } as unknown as DynamoDB.DocumentClient;
  const params = {} as DynamoDB.DocumentClient.QueryInput;
  const getAccounts = new GetSuspendedAccounts(client, params);
  const h = new Helper<GetSuspendedAccounts>(getAccounts);
  it('should contain execute method', () => {
    const test = h.hasMethod(getAccounts, 'execute');
    expect(test).toEqual(true);
  });
  it('should contain handleCommonErrors method', () => {
    const test = h.hasMethod(getAccounts, 'handleCommonErrors');
    expect(test).toEqual(true);
  });
  it('should contain handleQueryError method', () => {
    const test = h.hasMethod(getAccounts, 'handleQueryError');
    expect(test).toEqual(true);
  });
  it('should contain output property', () => {
    const test = h.hasProperty(getAccounts, 'output');
    expect(test).toEqual(true);
  });
  it('should contain client property', () => {
    const test = h.hasProperty(getAccounts, 'client');
    expect(test).toEqual(true);
  });
  it('should contain params property', () => {
    const test = h.hasProperty(getAccounts, 'params');
    expect(test).toEqual(true);
  });
  it('should default output to an empty an array', () => {
    expect(getAccounts.output).toEqual([]);
  });

  describe('execute method', () => {
    it('should call client.query 1 time when no results', async () => {
      await getAccounts.execute();
      const spy = jest.spyOn(client, 'query');
      expect(spy).toHaveBeenCalledTimes(1);
      expect(getAccounts.params.ExclusiveStartKey).toBeUndefined();
    });
    it('should call client.query 2 times when LastEvaluatedKey defined', async () => {
      const mockPromise = jest.fn().mockReturnValueOnce({ LastEvaluatedKey: 'abc' }).mockReturnValueOnce({});
      const mockQuery = jest.fn().mockImplementation((param: DynamoDB.DocumentClient.QueryInput) => ({
        promise: mockPromise,
      }));
      const client = {
        query: mockQuery,
      } as unknown as DynamoDB.DocumentClient;
      const getAccounts2 = new GetSuspendedAccounts(client, params);
      const spy = jest.spyOn(client, 'query');
      await getAccounts2.execute();
      expect(spy).toHaveBeenCalledTimes(2);
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
      const getAccounts3 = new GetSuspendedAccounts(client, params);
      const spy = jest.spyOn(getAccounts3, 'handleQueryError');
      await getAccounts3.execute();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('I am an error');
    });
    it('should set the output to the Items returned from client', async () => {
      const mockPromise = jest
        .fn()
        .mockReturnValueOnce({ LastEvaluatedKey: 'abc', Items: [0] })
        .mockReturnValueOnce({ Items: [1] });
      const mockQuery = jest.fn().mockImplementation((param: DynamoDB.DocumentClient.QueryInput) => ({
        promise: mockPromise,
      }));
      const client = {
        query: mockQuery,
      } as unknown as DynamoDB.DocumentClient;
      const getAccounts4 = new GetSuspendedAccounts(client, params);
      await getAccounts4.execute();
      expect(getAccounts4.output).toEqual([0, 1]);
    });
  });
});
