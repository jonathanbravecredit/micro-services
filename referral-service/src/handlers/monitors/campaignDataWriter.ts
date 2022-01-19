import { DynamoDBStreamEvent, DynamoDBStreamHandler, Handler, StreamRecord } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { UpdateAppDataInput } from 'lib/aws/api.service';
import { Campaign } from 'lib/models/campaign.model';
import { getCampaign, updateCurrentCampaign } from 'lib/queries';
import * as moment from 'moment';

export const main: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent): Promise<void> => {
  const records = event.Records;
  records.forEach((r) => {
    if (r.eventName === 'MODIFY') {
      const stream: StreamRecord = r.dynamodb || {};
      const { OldImage, NewImage } = stream;
      if (!OldImage || !NewImage) return;
      const oldImage = DynamoDB.Converter.unmarshall(OldImage) as unknown as Campaign;
      const newImage = DynamoDB.Converter.unmarshall(NewImage) as unknown as Campaign;
      const { pKey, version } = newImage;
      if (pKey === 1 && version === 0 && oldImage.currentVersion !== newImage.currentVersion) {
        // a new current version has been updated
        // update the referral table
      }
    }
  });
  // this monitors the campaigns table...
  // when a campaign ends it needs to do the following...the current campaign has been updated
  // 1. update the campaign in the referral database to the current campaign...in most cases it will be the default.
  // 2. it needs to move the current campaign attributes to the prior campaign attributes
};
