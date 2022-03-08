'use strict';
import { DynamoDBRecord, DynamoDBStreamEvent, DynamoDBStreamHandler, StreamRecord } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import { CreditReport } from 'lib/interfaces/credit-report.interface';
import { getUsersBySub } from 'lib/queries/cognito.queries';
import { Mailchimp } from 'lib/utils/mailchimp/mailchimp';

const sns = new AWS.SNS();
const pool = process.env.POOL || '';

export const main: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent): Promise<void> => {
  const records = event.Records;
  // mailchimp emails
  try {
    await Promise.all(
      records.map(async (record: DynamoDBRecord) => {
        const message = JSON.stringify(record, null, 2);
        if (record.eventName == 'MODIFY') {
          const stream: StreamRecord = record.dynamodb || {};
          const { NewImage } = stream;
          if (!NewImage) return;
          const newImage = AWS.DynamoDB.Converter.unmarshall(NewImage) as unknown as CreditReport;
          const { UserAttributes } = await getUsersBySub(pool, newImage.userId);
          const email =
            UserAttributes?.find((attr) => {
              return attr.Name === 'email';
            })?.Value || '';
          const mailchimpTriggers = Mailchimp.transactional.report.resolver(null, newImage, record.eventName);
          // now need to go through all the triggered emails and send them (immediately for now) when appropriately
          console.log('triggers ===> ', mailchimpTriggers);
          try {
            await Promise.all(
              mailchimpTriggers?.map(async (trigger) => {
                const { data, template } = trigger;
                if (data?.api !== 'transactional') return;
                const message = Mailchimp.createMailMessage(email, template);
                const payload = Mailchimp.createSNSPayload('transactional', message, 'mailchimp');
                console.log('SNS payload ===> ', payload);
                await sns
                  .publish(payload)
                  .promise()
                  .then((data: any) => {
                    console.log('Results from sending message: ', JSON.stringify(data, null, 2));
                  })
                  .catch((err: any) => {
                    console.error('Unable to send message. Error JSON:', JSON.stringify(err, null, 2));
                  });
              }),
            );
          } catch (err) {
            console.log('sns error ==> ', err);
          }
        }
      }),
    );
  } catch (err) {
    console.log('dynamodb error ===> ', err);
  }
};