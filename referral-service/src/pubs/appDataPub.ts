'use strict';
import 'reflect-metadata';
import { DynamoDBRecord, DynamoDBStreamEvent, DynamoDBStreamHandler, StreamRecord } from 'aws-lambda';
import { SNS, DynamoDB } from 'aws-sdk';
import { UpdateAppDataInput } from 'libs/aws/api.service';
import { PubSubUtil } from 'libs/utils/pubsub/pubsub';

const sns = new SNS({ region: 'us-east-2' });
const pubsub = new PubSubUtil();

export const main: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent): Promise<void> => {
  const records = event.Records;
  try {
    await Promise.all(
      records.map(async (record: DynamoDBRecord) => {
        if (record.eventName == 'MODIFY') {
          const stream: StreamRecord = record.dynamodb || {};
          const { OldImage, NewImage } = stream;
          if (!OldImage || !NewImage) return;
          const oldImage = DynamoDB.Converter.unmarshall(OldImage) as unknown as UpdateAppDataInput;
          const newImage = DynamoDB.Converter.unmarshall(NewImage) as unknown as UpdateAppDataInput;
          const oldEnrolled = oldImage.agencies?.transunion?.enrolled || false;
          const newEnrolled = newImage.agencies?.transunion?.enrolled || false;
          if (!oldEnrolled && newEnrolled) {
            const subject = 'transunionenrollment';
            const service = 'referralservice';
            const message = newImage;
            const payload = pubsub.createSNSPayload<UpdateAppDataInput>(subject, message, service);
            await sns.publish(payload).promise();
          }
        }
      }),
    );
  } catch (err) {
    console.log('dynamodb error ===> ', err);
  }
};
