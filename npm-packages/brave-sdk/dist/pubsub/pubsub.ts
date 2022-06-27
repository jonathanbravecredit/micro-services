import { SNS } from "aws-sdk";

export class PubSubUtil {
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
}
