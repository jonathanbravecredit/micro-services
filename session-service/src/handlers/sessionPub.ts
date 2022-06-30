import { DynamoDBRecord, DynamoDBStreamEvent, DynamoDBStreamHandler } from "aws-lambda";
import { SNS, DynamoDB } from "aws-sdk";
import { Session } from "lib/models/session.model";
import { PubSubUtil } from "@bravecredit/brave-sdk";

const sns = new SNS({ region: "us-east-2" });
const pubsub = new PubSubUtil();

export const main: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent): Promise<void> => {
  const records = event.Records;
  records.forEach((r) => {
    console.log("session Pub records: ", JSON.stringify(r));
  });
  try {
    await Promise.all(
      records.map(async (r) => {
        const stream = r.dynamodb || {};
        const { NewImage } = stream;
        if (!NewImage) return;
        const subject = "sessiondataupdate";
        const service = "referralservice";
        const newImage = DynamoDB.Converter.unmarshall(NewImage) as unknown as Session;
        const message = newImage;
        const payload = pubsub.createSNSPayload<Session>(
          subject,
          message,
          service,
          process.env.REFERRAL_TOPIC_ARN || ""
        );
        await sns.publish(payload).promise();
      })
    );
  } catch (err) {
    console.log("error in session pub: ", JSON.stringify(err));
  }
};
