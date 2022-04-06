import { mocked } from 'ts-jest/utils';
import * as lambda from 'src/subs/campaigns/campaigns';
import { CampaignMonitor } from 'libs/utils/monitors/campaignMonitor';

jest.mock('libs/utils/monitors/campaignMonitor');

describe('campaigns lambda', () => {
  const mockedMonitor = mocked(CampaignMonitor);
  const arg1 = null as any;
  const arg2 = null as any;
  const event = { Records: null } as any;
  beforeEach(() => {
    mockedMonitor.mockReset();
  });
  it('should create a CampaignMonitor instance', async () => {
    await lambda.main(event, arg1, arg2);
    const mock = mockedMonitor.mock.instances[0];
    expect(mock).not.toBeUndefined();
  });
  it('should call the monitor method on CampaignMonitor instance', async () => {
    await lambda.main(event, arg1, arg2);
    const mock = mockedMonitor.mock.instances[0].monitor;
    expect(mock).toHaveBeenCalled();
  });
});
