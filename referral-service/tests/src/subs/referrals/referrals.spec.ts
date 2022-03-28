import { mocked } from 'ts-jest/utils';
import * as lambda from 'src/subs/referrals/referrals';
import { ReferralMonitor } from 'libs/utils/monitors/referralMonitor';

jest.mock('libs/utils/monitors/referralMonitor');

describe('referrals lambda', () => {
  const mockedMonitor = mocked(ReferralMonitor);
  const arg1 = null as any;
  const arg2 = null as any;
  const event = { Records: null } as any;
  beforeEach(() => {
    mockedMonitor.mockReset();
  });
  it('should create a ReferralMonitor instance', async () => {
    await lambda.main(event, arg1, arg2);
    const mock = mockedMonitor.mock.instances[0];
    expect(mock).not.toBeUndefined();
  });
  it('should call the monitor method on ReferralMonitor instance', async () => {
    await lambda.main(event, arg1, arg2);
    const mock = mockedMonitor.mock.instances[0].monitor;
    expect(mock).toHaveBeenCalled();
  });
});
