import 'reflect-metadata';
import {
  DynamoDBRecord,
  DynamoDBStreamEvent,
  DynamoDBStreamHandler,
  SNSEvent,
  SNSEventRecord,
  SNSHandler,
  StreamRecord,
} from 'aws-lambda';
import { DynamoDBorSNSRecord } from 'libs/interfaces';
import { getCampaign } from 'libs/queries/campaigns/campaigns.queries';
import { Aggregator } from 'libs/utils/aggregator/aggregator';
import { Campaign } from 'libs/models/campaigns/campaign.model';

export const main: DynamoDBStreamHandler | SNSHandler = async (
  event: DynamoDBStreamEvent | SNSEvent,
): Promise<void> => {
  const records = event.Records;
  const current = (await getCampaign(1, 0)) as Campaign; // 1, 0 is always populated
  if (!records || !current) return;
  try {
    await Promise.all(
      records.map(async (record: DynamoDBorSNSRecord) => {
        const isDynamo = (record as DynamoDBRecord).eventSource === 'aws:dynamodb';
        const isSNS = (record as SNSEventRecord).EventSource === 'aws:sns';
        if (isDynamo) {
          const aggregator = new Aggregator(current, record as DynamoDBRecord);
          await aggregator.qualifyReferral();
        }

        if (isSNS) {
          // no events for aggregator now...enrollments handled above
        }
      }),
    );
  } catch (err) {
    console.log('error in referral aggregator: ', JSON.stringify(err));
  }
};
