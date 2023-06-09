'use strict';
import { DynamoDBRecord, DynamoDBStreamEvent, DynamoDBStreamHandler, StreamRecord } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { IDispute } from 'libs/interfaces';
import { getUsersBySub } from 'libs/queries/cognito.queries';
import { SecureMail } from 'libs/utils/securemail/securemail';

const pool = process.env.POOL || '';

export const main: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent): Promise<void> => {
  const records = event.Records;
  // mailchimp emails
  // no emails currently going through Mailchimp, even transactional ones

  // secure emails
  try {
    await Promise.all(
      records.map(async (record: DynamoDBRecord) => {
        const message = JSON.stringify(record, null, 2);
        if (record.eventName == 'MODIFY') {
          const stream: StreamRecord = record.dynamodb || {};
          const { OldImage, NewImage } = stream;
          if (!OldImage || !NewImage) return;
          const oldImage = DynamoDB.Converter.unmarshall(OldImage) as unknown as IDispute;
          const newImage = DynamoDB.Converter.unmarshall(NewImage) as unknown as IDispute;
          const { UserAttributes } = await getUsersBySub(pool, newImage.id);
          const email =
            UserAttributes?.find((attr) => {
              return attr.Name === 'email';
            })?.Value || '';

          const securemailTriggers = SecureMail.triggers.resolver(oldImage, newImage, record.eventName);
          // add secure triggers here
          console.log('triggers ===> ', securemailTriggers);
          try {
            await Promise.all(
              securemailTriggers?.map(async (trigger) => {
                // this is the result from generator
                //...only one generator right now
                //...TODO, need to make it handle different types of generators
                const params = {
                  from: trigger.data.from,
                  subject: trigger.data.subject,
                  html: trigger.data.payload,
                  to: [email],
                };
                await SecureMail.sendMail(params);
              }),
            );
          } catch (err) {
            console.log('secure mail error ==> ', err);
          }
        }
      }),
    );
  } catch (err) {
    console.log('fall through err ==> ', err);
  }

  try {
    await Promise.all(
      records.map(async (record: DynamoDBRecord) => {
        const message = JSON.stringify(record, null, 2);
        if (record.eventName == 'INSERT') {
          const stream: StreamRecord = record.dynamodb || {};
          const { NewImage } = stream;
          if (!NewImage) return;
          const newImage = DynamoDB.Converter.unmarshall(NewImage) as unknown as IDispute;
          const { UserAttributes } = await getUsersBySub(pool, newImage.id);
          const email =
            UserAttributes?.find((attr: any) => {
              return attr.Name === 'email';
            })?.Value || '';

          const securemailTriggers = SecureMail.triggers.resolver(null, newImage, record.eventName);
          // add secure triggers here
          console.log('triggers ===> ', securemailTriggers);
          try {
            await Promise.all(
              securemailTriggers?.map(async (trigger) => {
                // this is the result from generator
                //...only one generator right now
                //...TODO, need to make it handle different types of generators
                const params = {
                  from: trigger.data.from,
                  subject: trigger.data.subject,
                  html: trigger.data.payload,
                  to: [email],
                };
                await SecureMail.sendMail(params);
              }),
            );
          } catch (err) {
            console.log('secure mail error ==> ', err);
          }
        }
      }),
    );
  } catch (err) {
    console.log('fall through err ==> ', err);
  }
};
