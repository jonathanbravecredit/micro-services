import 'reflect-metadata';
import { DynamoDBStreamEvent, DynamoDBStreamHandler, StreamRecord } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { Referral } from 'lib/models/referral.model';
import { updateReferral } from 'lib/queries';

export const main: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent): Promise<void> => {
  /*============================================*/
  //      SUSPENSION UPDATES
  /*============================================*/
  const suspensions = event.Records.filter((r) => {
    if (r.eventName !== 'MODIFY') return false;
    const stream: StreamRecord = r.dynamodb || {};
    const { OldImage, NewImage } = stream;
    if (!OldImage || !NewImage) return;
    const oldImage = DynamoDB.Converter.unmarshall(OldImage) as unknown as Referral;
    const newImage = DynamoDB.Converter.unmarshall(NewImage) as unknown as Referral;
    if (oldImage.suspended === newImage.suspended) return false; // no change in status
    return newImage.suspended;
  });

  try {
    await Promise.all(
      suspensions.map(async (r) => {
        const stream: StreamRecord = r.dynamodb || {};
        const { NewImage } = stream;
        if (!NewImage) return;
        const referral = DynamoDB.Converter.unmarshall(NewImage) as unknown as Referral;
        const suspended = {
          ...referral,
          eligible: 0,
          suspended: true,
          campaignActive: 'NO_CAMPAIGN',
          campaignActiveReferred: 0,
          campaignActiveEarned: 0,
          campaignActivePaid: 0,
          campaignActiveAddOn: 0,
          campaignActiveBonus: 0,
          campaignPrior: 'NO_CAMPAIGN',
          campaignPriorReferred: 0,
          campaignPriorEarned: 0,
          campaignPriorPaid: 0,
          campaignPriorAddOn: 0,
          campaignPriorBonus: 0,
          nextPaymentDate: 'SUSPENDED',
        } as Referral;
        await updateReferral(suspended);
      }),
    );
  } catch (err) {
    console.log('error in referral suspended monitor: ', JSON.stringify(err));
  }
};
