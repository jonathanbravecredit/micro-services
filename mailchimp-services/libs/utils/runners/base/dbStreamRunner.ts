import { DynamoDBRecord, StreamRecord } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

export class DBStreamRunner<T> {
  currImage: T | null | undefined;
  priorImage: T | null | undefined;
  constructor(public record: DynamoDBRecord) {
    this.init();
  }

  init() {
    this.parseImages(this.record);
  }

  parseImages(record: DynamoDBRecord) {
    const stream: StreamRecord = record.dynamodb || {};
    const { OldImage: priorImage, NewImage: currImage } = stream;
    this.currImage = this.unmarshall(currImage);
    this.priorImage = this.unmarshall(priorImage);
  }

  unmarshall(image: DynamoDB.AttributeMap | undefined): T | null {
    if (!image) return null;
    return DynamoDB.Converter.unmarshall(image) as unknown as T;
  }
}
