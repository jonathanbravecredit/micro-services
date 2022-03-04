import { SNS, AWSError } from 'aws-sdk';
const sns = new SNS();

export class PubSubUtil {
  payload: SNS.PublishInput | undefined;

  createSNSPayload<T>(subject: string, command: string, message: T, service: string, topic: string): SNS.PublishInput {
    this.payload = {
      Subject: subject,
      Message: JSON.stringify({
        service: service,
        command: command,
        message: message,
      }),
      MessageAttributes: {
        service: {
          DataType: 'String',
          StringValue: service,
        },
      },
      TopicArn: topic || '',
    };
    return this.payload;
  }

  async publishSNSPayload(): Promise<void> {
    if (!this.payload) throw 'payload must be set to publish';
    await sns
      .publish(this.payload)
      .promise()
      .then((data: SNS.PublishResponse) => {
        console.log('Results from sending message: ', JSON.stringify(data, null, 2));
      })
      .catch((err: AWSError) => {
        console.error('Unable to send message. Error JSON:', JSON.stringify(err, null, 2));
      });
  }
}
