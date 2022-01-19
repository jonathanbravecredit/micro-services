import {
  DynamoDBRecord,
  DynamoDBStreamEvent,
  DynamoDBStreamHandler,
  SNSEvent,
  SNSEventRecord,
  SNSHandler,
  StreamRecord,
} from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { DynamoDBorSNSRecord } from 'lib/interfaces';
import { Referral } from 'lib/models/referral.model';
import { getCampaign, getReferralByCode, updateReferral } from 'lib/queries';

export const main: DynamoDBStreamHandler | SNSHandler = async (
  event: DynamoDBStreamEvent | SNSEvent,
): Promise<void> => {
  const records = event.Records;
  records.forEach((r: DynamoDBorSNSRecord) => {
    console.log('referral aggregator record: ', JSON.stringify(r));
  });

  const current = await getCampaign(1, 0);
  if (!current || current?.campaign === 'NO_CAMPAIGN') return;

  await Promise.all(
    records.map(async (r: DynamoDBorSNSRecord) => {
      const isDynamo = (r as DynamoDBRecord).eventSource === 'aws:dynamodb';
      const isSNS = (r as SNSEventRecord).EventSource === 'aws:sns';
      if (isDynamo) {
        // do dynamodb stuff
        // data coming from referral data base. inserts and modifications
        // only concerned with inserts
        const dynamo = r as DynamoDBRecord;
        const stream: StreamRecord = dynamo.dynamodb || {};
        const { NewImage } = stream;
        if (!NewImage) return;
        const newImage = DynamoDB.Converter.unmarshall(NewImage) as unknown as Referral;
        // need to find if there is a referred by code
        // if there is than we need to:
        //  - get the current campaign attributes
        //  - double check the current campaign is an active one
        //  - increment up the count and the earnings...campaignActiveReferred
        if (newImage.referredByCode) {
          const { denomination, bonusThreshold, bonusAmount } = current;
          // get the record by referredByCode
          const referral = await getReferralByCode(newImage.referredByCode);
          if (!referral) return;
          // check if the bonus threshold is hit...wasn't and now would be
          const bonus = (referral.campaignActiveReferred || -1) + 1 === bonusThreshold ? bonusAmount : 0;
          const earned = referral.campaignActiveEarned + denomination + bonus;
          const referred = referral.campaignActiveReferred + 1;
          const baseEarned = referral.baseEarned + denomination + bonus;
          const bonusEarned = referral.bonusEarned + bonus;
          const updated = {
            ...referral,
            campaignActiveReferred: referred,
            campaignActiveEarned: earned,
            baseEarned: baseEarned,
            bonusEarned: bonusEarned,
          };
          await updateReferral(updated);
        }
      }

      if (isSNS) {
        // do sns related stuff TODO
        // sns will only look for add ons. enrollments, etc
        const sns = r as SNSEventRecord;
        console.log('sns record ==> ', JSON.stringify(sns));
      }
    }),
  );
};
