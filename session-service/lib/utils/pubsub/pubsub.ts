import { SNS } from 'aws-sdk';

export class PubSubUtil {
  constructor() {}

  createSNSPayload<T>(subject: string, message: T, service: string): SNS.PublishInput {
    return {
      Subject: subject,
      Message: JSON.stringify({
        service: service,
        command: 'POST',
        message: message,
      }),
      MessageAttributes: {
        service: {
          DataType: 'String',
          StringValue: service,
        },
      },
      TopicArn: process.env.REFERRAL_TOPIC_ARN || '',
    };
  }
}
