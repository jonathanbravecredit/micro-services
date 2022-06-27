import { SNS } from "aws-sdk";
const sns = new SNS();

export class PubSubUtil {
  payload: SNS.PublishInput | undefined;

  constructor() {}

  createSNSPayload<T>(subject: string, message: T, service: string, topicArn: string): SNS.PublishInput {
    return {
      Subject: subject,
      Message: JSON.stringify({
        service: service,
        command: "POST",
        message: message,
      }),
      MessageAttributes: {
        service: {
          DataType: "String",
          StringValue: service,
        },
      },
      TopicArn: topicArn || "",
    };
  }

  async publishSNSPayload() {
    if (!this.payload) throw "payload must be set to publish";
    await sns
      .publish(this.payload)
      .promise()
      .then((data) => {
        console.log("Results from sending message: ", JSON.stringify(data, null, 2));
      })
      .catch((err) => {
        console.error("Unable to send message. Error JSON:", JSON.stringify(err, null, 2));
      });
  }
}
