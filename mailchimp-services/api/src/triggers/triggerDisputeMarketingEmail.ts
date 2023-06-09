'use strict';
import { DynamoDBRecord, DynamoDBStreamEvent, DynamoDBStreamHandler, StreamRecord } from 'aws-lambda';
import { SNS, DynamoDB } from 'aws-sdk';
import { IDispute } from 'libs/interfaces';
import { getUsersBySub } from 'libs/queries/cognito.queries';
import { Mailchimp } from 'libs/utils/mailchimp/mailchimp';

const sns = new SNS();
const pool = process.env.POOL || '';

export const main: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent): Promise<void> => {
  const records = event.Records;
  // mailchimp emails
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
          const mailchimpTriggers = Mailchimp.marketing.dispute.resolver(null, newImage, record.eventName);
          // now need to go through all the triggered emails and send them (immediately for now) when appropriately
          console.log('triggers ===> ', mailchimpTriggers);
          try {
            await Promise.all(
              mailchimpTriggers?.map(async (trigger) => {
                const { data } = trigger;
                if (data?.api !== 'marketing') return;
                const message = Mailchimp.createMailMessage(email, 'tag_user', undefined, data.tag);
                const payload = Mailchimp.createSNSPayload('marketing', message, 'marketing');
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
