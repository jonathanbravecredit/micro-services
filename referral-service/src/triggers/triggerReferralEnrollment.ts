'use strict';
import 'reflect-metadata';
import { DynamoDBRecord, DynamoDBStreamEvent, DynamoDBStreamHandler, StreamRecord } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import { UpdateAppDataInput } from 'lib/aws/api.service';
import { enrollReferral } from 'lib/queries';

export const main: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent): Promise<void> => {
  const records = event.Records;
  console.log('records ==> ', JSON.stringify(records));
  // mailchimp emails
  try {
    await Promise.all(
      records.map(async (record: DynamoDBRecord) => {
        if (record.eventName == 'MODIFY') {
          const stream: StreamRecord = record.dynamodb || {};
          const { OldImage, NewImage } = stream;
          if (!OldImage || !NewImage) return;
          const oldImage = AWS.DynamoDB.Converter.unmarshall(OldImage) as unknown as UpdateAppDataInput;
          const newImage = AWS.DynamoDB.Converter.unmarshall(NewImage) as unknown as UpdateAppDataInput;
          const oldEnrolled = oldImage.agencies?.transunion?.enrolled || false;
          const newEnrolled = newImage.agencies?.transunion?.enrolled || false;
          if (!oldEnrolled && newEnrolled) {
            // const resp = await enrollReferral(newImage.id);
            // console.log('referral update resp ===> ', resp);
          }
        }
      }),
    );
  } catch (err) {
    console.log('dynamodb error ===> ', err);
  }
};
