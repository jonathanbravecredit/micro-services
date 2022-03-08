import 'reflect-metadata';
import { DynamoDBStreamEvent, DynamoDBStreamHandler, StreamRecord } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { Campaign } from 'lib/models/campaign.model';
import {
  getActiveCampaignReferrals,
  getCampaign,
  getEligibileReferrals,
  updateReferral,
  updateReferralCampaign,
} from 'lib/queries';

export const main: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent): Promise<void> => {
  const records = event.Records;
  records.forEach((r) => {
    console.log('campaign data writer record: ', JSON.stringify(r));
  });

  // // Only runs once. when a new campaign is activated.
  await Promise.all(
    records.map(async (r) => {
      if (r.eventName === 'MODIFY') {
        const stream: StreamRecord = r.dynamodb || {};
        const { OldImage, NewImage } = stream;
        if (!OldImage || !NewImage) return;
        const oldImage = DynamoDB.Converter.unmarshall(OldImage) as unknown as Campaign;
        const newImage = DynamoDB.Converter.unmarshall(NewImage) as unknown as Campaign;
        const { pKey, version } = newImage;
        const noCampaign = await getCampaign(1, 1);

        // the active campaign is no longer....shutting off. campaign ==> 'NO_CAMPAIGN'
        if (
          pKey === 1 &&
          version === 0 &&
          oldImage.currentVersion !== newImage.currentVersion &&
          newImage.campaign === noCampaign?.campaign
        ) {
          try {
            const activeReferrals = await getActiveCampaignReferrals(oldImage.campaign);
            await Promise.all(
              activeReferrals.map(async (r) => {
                // 1. update the campaign to the default
                // 2. move the current campaign values to the prior campaign attributes
                // 3. reset the notification flag, so we can better control emails.
                const now = new Date().toISOString();
                const updated = {
                  ...r,
                  campaignActive: newImage.campaign,
                  // campaignActiveReferred: 0,
                  // campaignActiveEarned: 0,
                  // campaignActivePaid: 0,
                  // campaignActiveAddOn: 0,
                  // campaignActiveBonus: 0,
                  // campaignPrior: oldImage.campaign,
                  // campaignPriorReferred: r.campaignActiveReferred,
                  // campaignPriorEarned: r.campaignActiveEarned,
                  // campaignPriorPaid: r.campaignActivePaid,
                  // campaignPriorAddOn: r.campaignActiveAddOn,
                  // campaignPriorBonus: r.campaignActiveBonus,
                  // nextPaymentDate: '',
                  // notified: false,
                  modifiedOn: now,
                };
                try {
                  await updateReferral(updated);
                } catch (err) {
                  console.log('error updating referral 1: ', JSON.stringify(err));
                }
              }),
            );
          } catch (err) {
            console.log('error updating current referrals: ', err);
          }
        }

        // a new active campaign has been added...enable for eligible
        if (
          pKey === 1 &&
          version === 0 &&
          oldImage.currentVersion !== newImage.currentVersion &&
          newImage.campaign !== noCampaign?.campaign &&
          newImage.campaign !== 'NO_CAMPAIGN'
        ) {
          try {
            const eligibleReferrals = await getEligibileReferrals();
            await Promise.all(
              eligibleReferrals.map(async (r) => {
                // 1. update the campaign to the current campaign active
                try {
                  const resp = await updateReferralCampaign(r.id, newImage.campaign);
                  console.log('resp: ', JSON.stringify(resp));
                } catch (err) {
                  console.log('error updating referral 2: ', JSON.stringify(err));
                }
              }),
            );
          } catch (err) {
            console.log('error updating eligible referrals: ', err);
          }
        }
      }
    }),
  );
};
