import { DynamoDBRecord, StreamRecord } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

export class DBStreamRunner<T> {
  currImage!: T;
  priorImage!: T | null;
  event: 'INSERT' | 'MODIFY' | 'REMOVE' | undefined;
  constructor(public record: DynamoDBRecord) {
    this.init();
  }

  init() {
    this.parseImages(this.record);
  }

  parseImages(record: DynamoDBRecord): void {
    const stream: StreamRecord = record.dynamodb || {};
    const { OldImage: priorImage, NewImage: currImage } = stream;
    this.currImage = this.unmarshall(currImage) as T;
    this.priorImage = this.unmarshall(priorImage) as T | null;
  }

  parseEvent(record: DynamoDBRecord): void {
    this.event = record.eventName;
  }

  unmarshall(image: DynamoDB.AttributeMap | undefined): T | null {
    if (!image) return null;
    return DynamoDB.Converter.unmarshall(image) as unknown as T;
  }
}
