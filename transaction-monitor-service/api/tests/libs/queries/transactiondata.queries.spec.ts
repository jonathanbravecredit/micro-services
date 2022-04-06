import { DynamoStore, UpdateRequest } from '@shiftcoders/dynamo-easy';
import { TransactionDataQueries } from 'libs/queries/transactiondata';
import { Helper } from 'tests/helpers/test-helper';

describe('TransactionDataQueries', () => {
  let queries: TransactionDataQueries | undefined;
  let h: Helper<TransactionDataQueries>;
  beforeEach(() => {
    queries = new TransactionDataQueries();
    h = new Helper<TransactionDataQueries>(queries);
  });
  describe('Properties and methods', () => {
    it('should have a property called store of instance DynamoStore', () => {
      expect(TransactionDataQueries.store).toBeDefined();
      expect(TransactionDataQueries.store).toBeInstanceOf(DynamoStore);
    });
    it('should have a method named "getTransaction"', () => {
      expect(TransactionDataQueries.getTransaction).toBeDefined();
    });
    it('should have a method named "createTransaction"', () => {
      expect(TransactionDataQueries.createTransaction).toBeDefined();
    });
    it('should have a method named "deleteTransaction"', () => {
      expect(TransactionDataQueries.createTransaction).toBeDefined();
    });
  });

  describe('getTransaction method', () => {
    const execSingleMock = jest.fn().mockImplementation(() => {
      return Promise;
    });
    const gteMock = jest.fn().mockImplementation((arg: any) => {
      return null as any;
    });
    const attrMock = jest.fn().mockImplementation((arg: string) => {
      return { gte: gteMock };
    });
    const whereMock = jest.fn().mockImplementation((arg: typeof attrMock) => {
      return { execSingle: execSingleMock };
    });
    const eqMock = jest.fn().mockImplementation((arg: string) => {
      return { where: whereMock };
    });
    const whereSortKeyMock = jest.fn().mockImplementation(() => {
      return { eq: eqMock };
    });
    const wherePartitionKeyMock = jest.fn().mockImplementation((arg: string) => {
      return { whereSortKey: whereSortKeyMock };
    });
    afterEach(() => {
      execSingleMock.mockClear();
      gteMock.mockClear();
      attrMock.mockClear();
      whereMock.mockClear();
      eqMock.mockClear();
      whereSortKeyMock.mockClear();
      wherePartitionKeyMock.mockClear();
    });
    it('should call "this.store.query"', () => {
      const spy = jest.spyOn(TransactionDataQueries.store, 'query').mockImplementation(() => {
        return { wherePartitionKey: wherePartitionKeyMock } as any;
      });
      TransactionDataQueries.getTransaction('abc', 'trans_name');
      expect(spy).toHaveBeenCalled();
      expect(wherePartitionKeyMock).toHaveBeenCalledWith('abc');
      expect(whereSortKeyMock).toHaveBeenCalledWith();
      expect(eqMock).toHaveBeenCalledWith('trans_name');
      expect(whereMock).toHaveBeenCalled();
      expect(execSingleMock).toHaveBeenCalledWith();
    });
  });

  describe('createTransaction method', () => {
    const execMock = jest.fn().mockImplementation(() => {
      return Promise;
    });
    const ifNotMock = jest.fn().mockImplementation(() => {
      return { exec: execMock };
    });
    afterEach(() => {
      execMock.mockClear();
      ifNotMock.mockClear();
    });
    it('should call "this.store.put"', () => {
      const execMock = jest.fn().mockImplementation(() => {
        return Promise;
      });
      const ifNotMock = jest.fn().mockImplementation(() => {
        return { exec: execMock };
      });
      const spy = jest.spyOn(TransactionDataQueries.store, 'put').mockImplementation((arg) => {
        return { ifNotExists: ifNotMock } as any;
      });
      TransactionDataQueries.createTransaction('abc' as any);
      expect(spy).toHaveBeenCalledWith('abc');
      expect(ifNotMock).toHaveBeenCalledWith();
      expect(execMock).toHaveBeenCalledWith();
    });
  });

  describe('deleteTransaction method', () => {
    const execMock = jest.fn().mockImplementation(() => {
      return Promise;
    });
    const ifNotMock = jest.fn().mockImplementation(() => {
      return { exec: execMock };
    });
    afterEach(() => {
      execMock.mockClear();
      ifNotMock.mockClear();
    });
    it('should call "this.store.delete"', () => {
      const execMock = jest.fn().mockImplementation(() => {
        return Promise;
      });
      const spy = jest.spyOn(TransactionDataQueries.store, 'delete').mockReturnValue({ exec: execMock } as any);
      TransactionDataQueries.deleteTransaction('abc', 'trans_name');
      expect(spy).toHaveBeenCalledWith('abc', 'trans_name');
      expect(execMock).toHaveBeenCalledWith();
    });
  });
});
