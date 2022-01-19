import { DynamoDBRecord, SNSEventRecord } from 'aws-lambda';

export type DynamoDBorSNSRecord = DynamoDBRecord | SNSEventRecord;
