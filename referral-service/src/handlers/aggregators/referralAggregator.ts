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
import { DynamoDB } from 'aws-sdk';
import { DynamoDBorSNSRecord } from 'lib/interfaces';
import { Referral } from 'lib/models/referral.model';
import { getCampaign, getReferral, getReferralByCode, updateReferral } from 'lib/queries';
import { PaymentDateCalculator } from 'lib/utils/paymentdatecalculator/paymentDateCalculator';
import * as moment from 'moment';

export const main: DynamoDBStreamHandler | SNSHandler = async (
  event: DynamoDBStreamEvent | SNSEvent,
): Promise<void> => {
  const records = event.Records;
  records.forEach((r: DynamoDBorSNSRecord) => {
    console.log('referral aggregator record: ', JSON.stringify(r));
  });

  const current = await getCampaign(1, 0);
  const now = new Date();
  const ended = moment(now).isAfter(current?.endDate);
  if (current && ended) return;

  console.log('current campaign: ', JSON.stringify(current));
  if (!current || current?.campaign === 'NO_CAMPAIGN') return;
  try {
    await Promise.all(
      records.map(async (r: DynamoDBorSNSRecord) => {
        const isDynamo = (r as DynamoDBRecord).eventSource === 'aws:dynamodb';
        const isSNS = (r as SNSEventRecord).EventSource === 'aws:sns';
        if (isDynamo) {
          // !!! REFERRAL Database !!!
          // do dynamodb stuff
          // data coming from referral data base. inserts and modifications
          // only concerned with modifies...people going from unenrolled to enrolled
          const dynamo = r as DynamoDBRecord;
          if (dynamo.eventName === 'INSERT') return;
          const stream: StreamRecord = dynamo.dynamodb || {};
          const { OldImage, NewImage } = stream;
          if (!NewImage || !OldImage) return;
          const newImage = DynamoDB.Converter.unmarshall(NewImage) as unknown as Referral;
          const oldImage = DynamoDB.Converter.unmarshall(OldImage) as unknown as Referral;
          // the referred user needs to go from enrolled to not in rolled
          // need to find if there is a referred by code
          // if there is than we need to:
          //  - get the current campaign attributes
          //  - double check the current campaign is an active one
          //  - increment up the count and the earnings...campaignActiveReferred
          const enrollment = oldImage.enrolled === false && newImage.enrolled === true;
          if (newImage.referredByCode && enrollment) {
            const { denomination, bonusThreshold, bonusAmount, campaign } = current;
            if (campaign === 'NO_CAMPAIGN') return;
            // get the record by referredByCode
            const referrer = await getReferralByCode(newImage.referredByCode);
            if (!referrer) return;
            // check if the bonus threshold is hit...wasn't and now would be
            const bonus = (referrer.campaignActiveReferred || -1) + 1 === bonusThreshold ? bonusAmount : 0;
            const campaignActiveBonus = referrer.campaignActiveBonus + bonus;
            const campaignActiveEarned = referrer.campaignActiveEarned + denomination;
            const campaignActiveReferred = referrer.campaignActiveReferred + 1;
            const totalEarned = referrer.totalEarned + denomination;
            const totalBonus = referrer.totalBonus + bonus;
            const bonusHit = bonus > 0;
            const nextPaymentDate = new PaymentDateCalculator().calcPaymentDate(bonusHit, current.endDate);
            const updated = {
              ...referrer,
              campaignActiveReferred,
              campaignActiveEarned,
              campaignActiveBonus,
              totalEarned,
              totalBonus,
              nextPaymentDate,
            };
            if (campaignActiveReferred > current.maxReferrals) return;
            await updateReferral(updated);
          }

          if (enrollment && current.campaign !== 'NO_CAMPAIGN' && current.addOnFlagOne === 'enrollment') {
            // need to give the user credit for enrolling
            const { denomination } = current;
            const referral = await getReferral(newImage.id);
            if (!referral) return;
            const campaignActiveAddOn = referral.campaignActiveAddOn + denomination;
            const nextPaymentDate = new PaymentDateCalculator().calcPaymentDate(false, current.endDate);
            const updated = {
              ...referral,
              campaignActiveAddOn,
              nextPaymentDate,
            };
            await updateReferral(updated);
          }
        }

        if (isSNS) {
          // sns will only look for add ons. enrollments, etc
          // these are their own enrollments
          // no events for aggregator now...enrollments handled above
        }
      }),
    );
  } catch (err) {
    console.log('error in referral aggregator: ', JSON.stringify(err));
  }
};
