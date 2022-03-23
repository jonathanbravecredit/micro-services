export class PubSubUtil {
  constructor() {}

  createSNSPayload<T>(subject: string, message: T, service: string = 'mailchimpbatch'): AWS.SNS.PublishInput {
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
      TopicArn: process.env.MAILCHIMP_SNS_ARN || '',
    };
  }
}
