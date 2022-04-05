import { DynamoDBRecord, StreamRecord } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

export class DBStreamRunner<T> {
  currImage: T | null = null;
  priorImage: T | null = null;
  event: 'INSERT' | 'MODIFY' | 'REMOVE' | undefined;
  constructor(public record: DynamoDBRecord) {}

  init() {
    this.parseImages();
    this.parseEvent();
  }

  parseImages(): void {
    const stream: StreamRecord = this.record.dynamodb || {};
    const { OldImage: priorImage, NewImage: currImage } = stream;
    this.currImage = currImage ? (this.unmarshall(currImage) as T) : null;
    this.priorImage = priorImage ? (this.unmarshall(priorImage) as T | null) : null;
  }

  parseEvent(): void {
    this.event = this.record.eventName;
  }

  unmarshall(image: DynamoDB.AttributeMap | undefined): T | null {
    if (!image) return null;
    return DynamoDB.Converter.unmarshall(image) as unknown as T;
  }
}
