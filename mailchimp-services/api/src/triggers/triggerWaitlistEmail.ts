"use strict";
import { DynamoDBRecord, DynamoDBStreamEvent, DynamoDBStreamHandler, StreamRecord } from "aws-lambda";
import { DynamoDB, SNS } from "aws-sdk";
import { Mailchimp } from "libs/utils/mailchimp/mailchimp";
import { Waitlist } from "@bravecredit/brave-sdk/dist/models/waitlist/waitlist";
import { MailchimpTriggerEmails } from "libs/utils/mailchimp/constants";

const sns = new SNS();

export const main: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent): Promise<void> => {
  const records = event.Records;
  // mailchimp emails
  try {
    await Promise.all(
      records.map(async (record: DynamoDBRecord) => {
        if (record.eventName == "INSERT") {
          const stream: StreamRecord = record.dynamodb || {};
          const { NewImage } = stream;
          if (!NewImage) return;
          const { referralCode, email } = DynamoDB.Converter.unmarshall(NewImage) as unknown as Waitlist;
          if (!referralCode || !email) return;
          try {
            const urlCode = `https://app.brave.credit/waitlist/?referralCode=${referralCode}`;
            const message = Mailchimp.createMailMessage(email, MailchimpTriggerEmails.ReferralCode, [
              { name: "URL_CODE", content: urlCode },
            ]); // TODO need to define the merge vars on the trigger
            const payload = Mailchimp.createSNSPayload("transactional", message);
            console.log("payload ===> ", payload);
            await sns
              .publish(payload)
              .promise()
              .then((data: any) => {
                console.log("Results from sending message: ", JSON.stringify(data, null, 2));
              })
              .catch((err: any) => {
                console.error("Unable to send message. Error JSON:", JSON.stringify(err, null, 2));
              });
          } catch (err) {
            console.log("sns error ==> ", err);
          }
        }
      }),
    );
  } catch (err) {
    console.log("dynamodb error ===> ", err);
  }
};
