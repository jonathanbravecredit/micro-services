"use strict";
import { DynamoDBRecord, DynamoDBStreamEvent, DynamoDBStreamHandler, StreamRecord } from "aws-lambda";
import { DynamoDB, SNS } from "aws-sdk";
import { getUsersBySub } from "libs/queries/cognito.queries";
import { Mailchimp } from "libs/utils/mailchimp/mailchimp";
import dayjs from "dayjs";
import { CampaignQueries, Referral } from "@bravecredit/brave-sdk";

const sns = new SNS();
const pool = process.env.POOL || "";

export const main: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent): Promise<void> => {
  const records = event.Records;
  // mailchimp emails
  try {
    await Promise.all(
      records.map(async (record: DynamoDBRecord) => {
        if (record.eventName == "MODIFY") {
          const stream: StreamRecord = record.dynamodb || {};
          const { OldImage, NewImage } = stream;
          if (!OldImage || !NewImage) return;
          const newImage = DynamoDB.Converter.unmarshall(NewImage) as unknown as Referral;
          const oldImage = DynamoDB.Converter.unmarshall(OldImage) as unknown as Referral;
          const { UserAttributes } = await getUsersBySub(pool, newImage.id);
          const campaign = await CampaignQueries.getCampaign(1, 0);
          if (campaign?.campaign === "NO_CAMPAIGN" || dayjs(new Date()).isAfter(new Date(campaign?.endDate || 0))) {
            console.log("blocking");
            return; // campaign ended don't send email
          }
          const email =
            UserAttributes?.find((attr) => {
              return attr.Name === "email";
            })?.Value || "";

          const mailchimpTriggers = Mailchimp.transactional.referral.resolver(oldImage, newImage);
          // now need to go through all the triggered emails and send them (immediately for now) when appropriately
          console.log("triggers ===> ", mailchimpTriggers);
          try {
            await Promise.all(
              mailchimpTriggers?.map(async (trigger) => {
                const { data, template } = trigger;
                if (data?.api !== "transactional") return;
                const urlCode = `https://app.brave.credit/auth/signup?referralCode=${data.payload}`;
                const message = Mailchimp.createMailMessage(email, template, [{ name: "URL_CODE", content: urlCode }]); // TODO need to define the merge vars on the trigger
                const payload = Mailchimp.createSNSPayload("transactional", message);
                console.log("SNS payload ===> ", payload);
                await sns
                  .publish(payload)
                  .promise()
                  .then((data: any) => {
                    console.log("Results from sending message: ", JSON.stringify(data, null, 2));
                  })
                  .catch((err: any) => {
                    console.error("Unable to send message. Error JSON:", JSON.stringify(err, null, 2));
                  });
              }),
            );
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
