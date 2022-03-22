'use strict';
import { DynamoDBRecord, DynamoDBStreamEvent, DynamoDBStreamHandler, StreamRecord } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import { CreditReport } from 'libs/interfaces/credit-report.interface';
import { updateNavbarCreditReportBadge } from 'libs/queries/appdata.queries';
import { getUsersBySub } from 'libs/queries/cognito.queries';
import { IMailchimpPacket, IMarketingData } from 'libs/utils/mailchimp/interfaces';
import { Mailchimp } from 'libs/utils/mailchimp/mailchimp';

const sns = new AWS.SNS();
const pool = process.env.POOL || '';

export const main: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent): Promise<void> => {
  const records = event.Records;
  const modifies = event.Records.filter((r) => r.eventName === 'MODIFY');
  console.log('records ==> ', JSON.stringify(records));
  // mailchimp emails

  if (modifies.length) {
    try {
      await Promise.all(
        modifies.map(async (record: DynamoDBRecord) => {
          const stream: StreamRecord = record.dynamodb || {};
          const { OldImage, NewImage } = stream;
          if (!OldImage || !NewImage) return;
          const oldImage = AWS.DynamoDB.Converter.unmarshall(OldImage) as unknown as CreditReport;
          const newImage = AWS.DynamoDB.Converter.unmarshall(NewImage) as unknown as CreditReport;
          const { UserAttributes } = await getUsersBySub(pool, newImage.userId);
          const email =
            UserAttributes?.find((attr) => {
              return attr.Name === 'email';
            })?.Value || '';
          const mailchimpTriggers = Mailchimp.marketing.notification.resolver(oldImage, newImage, 'MODIFY');
          // now need to go through all the triggered emails and send them (immediately for now) when appropriately
          console.log('triggers ===> ', JSON.stringify(mailchimpTriggers));
          if (mailchimpTriggers.filter(notificationFilter).length > 0) {
            const payload = { report: { badge: true } };
            await updateNavbarCreditReportBadge(newImage.userId, payload);
          }
        }),
      );
    } catch (err) {
      console.log('err: ', JSON.stringify(err));
    }
  }
};

const notificationFilter = (packet: IMailchimpPacket<IMarketingData>): boolean => {
  let active: boolean[] = [];
  packet.data?.tag?.forEach((tag) => {
    if (tag.status === 'active') {
      active = [...active, true];
    }
  });
  return active.length > 0;
};
