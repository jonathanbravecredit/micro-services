import { getCampaign } from 'libs/queries/campaigns/campaigns.queries';
import { mocked } from 'ts-jest/utils';
import * as lamdba from 'src/handlers/monitors/campaignDataWriter';
import { CampaignDataManager } from 'libs/utils/managers/campaignDataManager';
import { MOCK_CAMPAIGN_NO_CAMPAIGN, MOCK_MODIFY_ACTIVE_TO_ACTIVE } from 'tests/__mocks__/campaign.mocks';
import { DynamoDBRecord } from 'aws-lambda';

const mockedProcess = jest.fn().mockReturnValue(Promise.resolve());
jest.mock('libs/queries/campaigns/campaigns.queries');
jest.mock('libs/utils/managers/campaignDataManager', () => {
  return {
    CampaignDataManager: jest.fn().mockImplementation(() => {
      return {
        process: mockedProcess,
      };
    }),
  };
});
describe('campaignDataWriter', () => {
  const arg1 = null as any;
  const arg2 = null as any;
  const event = { Records: null } as any;
  const mockedGet = mocked(getCampaign).mockReturnValue(Promise.resolve(MOCK_CAMPAIGN_NO_CAMPAIGN));
  const mockedManager = mocked(new CampaignDataManager(MOCK_MODIFY_ACTIVE_TO_ACTIVE, MOCK_CAMPAIGN_NO_CAMPAIGN));
  beforeEach(() => {
    mockedGet.mockReturnValue(Promise.resolve(MOCK_CAMPAIGN_NO_CAMPAIGN));
  });
  it('should call getCampaign with args(1,1)', async () => {
    await lamdba.main(event, arg1, arg2);
    expect(mockedGet).toHaveBeenCalledWith(1, 1);
  });
  it('should return undefined if NO_CAMPAIGN not found', async () => {
    mockedGet.mockReturnValue(Promise.resolve(null));
    const event = { Records: [0, 1] as DynamoDBRecord[] };
    const res = await lamdba.main(event, arg1, arg2);
    expect(res).toBeUndefined();
  });
  it('should return undefined if no records', async () => {
    const res = await lamdba.main(event, arg1, arg2);
    expect(res).toBeUndefined();
  });
  it('should call process 2 times if 2 campaign data events', async () => {
    const event = { Records: [0, 1] as DynamoDBRecord[] };
    await lamdba.main(event, arg1, arg2);
    expect(mockedManager.process).toHaveBeenCalledTimes(2);
  });
});
