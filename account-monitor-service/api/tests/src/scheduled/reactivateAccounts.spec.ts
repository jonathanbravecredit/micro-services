import * as lambda from 'src/scheduled/reactivateAccounts';
import dayjs from 'dayjs';
import { v4 } from 'uuid';
import { mocked } from 'ts-jest/utils';
import { getSuspendedAccounts } from 'libs/queries/suspendedaccounts/list.query';
import { updateSuspendedAccount } from 'libs/queries/suspendedaccounts/update.query';

jest.mock('../../libs/queries/suspendedaccounts/list.query');
jest.mock('../../libs/queries/suspendedaccounts/update.query');
const mockedGet = mocked(getSuspendedAccounts);
const mockedUpdate = mocked(updateSuspendedAccount);
mockedGet.mockImplementation(() => {
  const mocks: AWS.DynamoDB.DocumentClient.AttributeMap[] = [];
  mocks.push(new MockAccount('suspended'));
  mocks.push(new MockAccount('suspended'));
  mocks.push(new MockAccount('suspended'));
  return Promise.resolve(mocks);
});
mockedUpdate.mockImplementation((id: string) => {
  return Promise.resolve({} as AWS.DynamoDB.DocumentClient.UpdateItemOutput);
});

describe('Reactivate Accounts Handler', () => {
  it('Should call "getReactivationAccount"', () => {
    mockedGet.mockClear();
    lambda.main(null, null, null);
    expect(getSuspendedAccounts).toHaveBeenCalled();
  });

  it('should return undefined if no reactivation accounts found', async () => {
    mockedGet.mockImplementationOnce(() => {
      return Promise.resolve(null);
    });
    const res = await lambda.main(null, null, null);
    expect(res).toBeUndefined();
  });
  it('should iterate thru results and update their status to active', async () => {
    mockedUpdate.mockClear();
    await lambda.main(null, null, null);
    expect(updateSuspendedAccount).toHaveBeenCalledTimes(3);
  });
  it('should NOT iterate thru when GET errors', async () => {
    mockedUpdate.mockClear();
    mockedGet.mockImplementationOnce(() => {
      throw 'Mock get error';
    });
    await lambda.main(null, null, null);
    expect(updateSuspendedAccount).not.toHaveBeenCalled();
  });
});

type MockStatus = 'active' | 'suspended' | 'cancelled';
class MockAccount {
  id: string;
  status: string;
  nextStatusModifiedOn: string;
  statusReasonDescription: string;
  lastStatusModifiedOn: string;
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
