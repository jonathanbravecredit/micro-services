import * as lambda from 'src/scheduled/reactivateAccounts';
import dayjs from 'dayjs';
import { v4 } from 'uuid';
import { mocked } from 'ts-jest/utils';
import { getSuspendedAccount } from 'libs/queries/suspendedaccounts/get.query';
import { getSuspendedAccounts } from 'libs/queries/suspendedaccounts/list.query';
import { updateSuspendedAccount } from 'libs/queries/suspendedaccounts/update.query';

jest.mock('../../libs/queries/suspendedaccounts/get.query');
jest.mock('../../libs/queries/suspendedaccounts/list.query');
jest.mock('../../libs/queries/suspendedaccounts/update.query');
const mockedGet = mocked(getSuspendedAccount);
const mockedList = mocked(getSuspendedAccounts);
const mockedUpdate = mocked(updateSuspendedAccount);
mockedGet.mockImplementation((id: string) => {
  const mock = new MockAccount('suspended') as AWS.DynamoDB.DocumentClient.AttributeMap;
  return Promise.resolve(mock);
});
mockedList.mockImplementation(() => {
  const mocks: AWS.DynamoDB.DocumentClient.AttributeMap[] = [];
  mocks.push(new MockAccount('suspended'));
  mocks.push(new MockAccount('suspended'));
  mocks.push(new MockAccount('suspended'));
  return Promise.resolve(mocks);
});
mockedUpdate.mockImplementation((id: string) => {
  return Promise.resolve({} as AWS.DynamoDB.DocumentClient.UpdateItemOutput);
});

describe('Reactivate Accounts Handler: no list', () => {
  const mockArg = {} as unknown as lambda.ListOrScheduled;
  it('Should call "getSuspendedAccounts"', async () => {
    mockedList.mockClear();
    await lambda.main(mockArg, {} as any, {} as any);
    expect(getSuspendedAccounts).toHaveBeenCalled();
  });

  it('should return undefined if no reactivation accounts found', async () => {
    mockedList.mockImplementationOnce(() => {
      return Promise.resolve(null);
    });
    const res = await lambda.main(mockArg, {} as any, {} as any);
    expect(res).toBeUndefined();
  });
  it('should iterate thru results and update their status to active', async () => {
    mockedUpdate.mockClear();
    await lambda.main(mockArg, {} as any, {} as any);
    expect(updateSuspendedAccount).toHaveBeenCalledTimes(3);
  });
  it('should NOT iterate thru when GET errors', async () => {
    mockedUpdate.mockClear();
    mockedList.mockImplementationOnce(() => {
      throw 'Mock get error';
    });
    await lambda.main(mockArg, {} as any, {} as any);
    expect(updateSuspendedAccount).not.toHaveBeenCalled();
  });
});

describe('Reactivate Accounts Handler: with list', () => {
  beforeEach(() => {
    mockedGet.mockClear();
    mockedList.mockClear();
    mockedUpdate.mockClear();
  });
  const mockArg = { list: ['abc', 'xyz'] } as unknown as lambda.ListOrScheduled;
  it('Should call "getSuspendedAccount"', async () => {
    await lambda.main(mockArg, {} as any, {} as any);
    expect(mockedGet).toHaveBeenCalledTimes(2);
  });
  it('should call updateSuspendedAccount if not null and as ID', async () => {
    mockedGet.mockImplementationOnce(() => {
      return Promise.resolve(null);
    });
    await lambda.main(mockArg, {} as any, {} as any);
    expect(mockedUpdate).not.toHaveBeenCalled();
  });
});

type MockStatus = 'active' | 'suspended' | 'cancelled';
class MockAccount {
  id: string;
  status!: string;
  nextStatusModifiedOn!: string;
  statusReasonDescription!: string;
  lastStatusModifiedOn!: string;
  constructor(private mockType: MockStatus) {
    this.id = v4();
    if (mockType === 'active') this.createActive();
    if (mockType === 'suspended') this.createActive();
    if (mockType === 'cancelled') this.createActive();
  }

  createActive(): void {
    this.status = 'active';
    this.nextStatusModifiedOn = dayjs(new Date()).add(-1, 'month').toISOString();
    this.statusReasonDescription = 'active';
    this.lastStatusModifiedOn = dayjs(new Date()).add(-3, 'month').toISOString();
  }

  createSuspended(): void {
    this.status = 'suspended';
    this.nextStatusModifiedOn = dayjs(new Date()).add(-1, 'month').toISOString();
    this.statusReasonDescription = 'suspended';
    this.lastStatusModifiedOn = dayjs(new Date()).add(-3, 'month').toISOString();
  }

  createCancelled(): void {
    this.status = 'cancelled';
    this.nextStatusModifiedOn = dayjs(new Date()).add(2, 'month').toISOString();
    this.statusReasonDescription = 'suspended';
    this.lastStatusModifiedOn = dayjs(new Date()).add(-1, 'month').toISOString();
  }
}
