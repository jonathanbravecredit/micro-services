import { DynamoDBRecord, SNSEvent } from 'aws-lambda';
import { Campaign } from 'libs/models/campaigns/campaign.model';
import { getCampaign } from 'libs/queries';
import { Aggregator } from 'libs/utils/aggregator/aggregator';
import { MOCK_CAMPAIGN_ACTIVE } from 'tests/__mocks__/campaign.mocks';
import { MOCK_UNENROLLED_TO_ENROLLED_MODIFY } from 'tests/__mocks__/referral.mocks';
import { mocked } from 'ts-jest/utils';
import * as lambda from 'src/handlers/aggregators/referralAggregator';

const mockQualify = jest.fn().mockReturnValue(Promise.resolve());
jest.mock('libs/utils/aggregator/aggregator', () => {
  return {
    Aggregator: jest.fn().mockImplementation((current: Campaign, record: DynamoDBRecord) => {
      return {
        qualifyReferral: mockQualify,
      };
    }),
  };
});
jest.mock('libs/queries/campaigns/campaigns.queries');

describe('referralAggregator main handler', () => {
  const mockedAgg = mocked(new Aggregator(MOCK_CAMPAIGN_ACTIVE, MOCK_UNENROLLED_TO_ENROLLED_MODIFY));
  const mockedGetCamp = mocked(getCampaign);
  const arg1 = null as any;
  const arg2 = null as any;
  const event = { Records: null } as any;
  beforeEach(() => {
    mockedGetCamp.mockReturnValue(Promise.resolve(MOCK_CAMPAIGN_ACTIVE));
  });
  it('should return undefined if records not defined', async () => {
    const res = await lambda.main(event, arg1, arg2);
    expect(res).toBeUndefined();
  });
  it('should return undefined if default campaign is not provided', async () => {
    const event = { Records: [] };
    mockedGetCamp.mockReturnValueOnce(Promise.resolve(null));
    const res = await lambda.main(event, arg1, arg2);
    expect(res).toBeUndefined();
  });
  it('should not call qualifyReferral if eventSource !== "aws:dynamodb"', async () => {
    const event = { Records: [{ EventSource: 'aws:sns' }, { eventSource: 'aws:sns' }] } as SNSEvent;
    await lambda.main(event, arg1, arg2);
    expect(mockedAgg.qualifyReferral).not.toHaveBeenCalled();
  });
  it('should call qualifyReferral ONLY if eventSource = "aws:dynamodb", not "EventSource"', async () => {
    const event = { Records: [{ EventSource: 'aws:dynamodb' }, { eventSource: 'aws:dynamodb' }] } as SNSEvent;
    await lambda.main(event, arg1, arg2);
    expect(mockedAgg.qualifyReferral).toHaveBeenCalledTimes(1);
  });
});
