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
import { UpdateAppDataInput } from 'lib/aws/api.service';
import { DynamoDBorSNSRecord } from 'lib/interfaces';
import { Referral } from 'lib/models/referral.model';
import { getCampaign, getReferral, getReferralByCode, updateReferral } from 'lib/queries';
import { AddOnsCalculator } from 'lib/utils/addons/addons';

export const main: DynamoDBStreamHandler | SNSHandler = async (
  event: DynamoDBStreamEvent | SNSEvent,
): Promise<void> => {
  const records = event.Records;
  records.forEach((r: DynamoDBorSNSRecord) => {
    console.log('referral aggregator record: ', JSON.stringify(r));
  });

  const current = await getCampaign(1, 0);
  if (!current || current?.campaign === 'NO_CAMPAIGN') return;
  try {
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
          // sns will only look for add ons. enrollments, etc
          const sns = r as SNSEventRecord;
          // currently only accepting enrollment data from app
          const t1 = sns.Sns.Subject === 'transunionenrollment';
          const { service, message } = JSON.parse(sns.Sns.Message) as {
            service: string;
            command: string;
            message: UpdateAppDataInput;
          };
          const t2 = service === 'referralservice';
          if (t1 && t2) {
            const { id } = message;
            const { denomination, bonusThreshold, bonusAmount, addOnFlagOne } = current;
            const referral = await getReferral(id);
            if (!referral) return;
            // check if the addon for enrollment is enabled
            const earned =
              addOnFlagOne === 'enrollment'
                ? referral.campaignActiveEarned + AddOnsCalculator.enrollemnt(denomination)
                : referral.campaignActiveEarned;
            // check if the bonus threshold is hit...wasn't and now would be
            const updated = {
              ...referral,
              enrolled: true,
              campaignActiveEarned: earned,
            };
            await updateReferral(updated);
          }
        }
      }),
    );
  } catch (err) {
    console.log('error in referral aggregator: ', JSON.stringify(err));
  }
};
