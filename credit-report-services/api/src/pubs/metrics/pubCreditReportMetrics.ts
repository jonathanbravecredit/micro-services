'use strict';
import * as AWS from 'aws-sdk';
import { DynamoDBRecord, DynamoDBStreamEvent, DynamoDBStreamHandler, StreamRecord } from 'aws-lambda';
import { CreditReport } from 'libs/models/CreditReport.model';
import { CreditReportMetrics } from 'libs/utils/metrics/CreditReportMetrics';
import { PubSubUtil } from 'libs/utils/pubsub/pubsub';

const arn = process.env.CREDIT_REPORT_METRICS_SNS_TOPIC;

export const main: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent): Promise<void> => {
  const records = event.Records;
  // mailchimp emails
  try {
    await Promise.all(
      records.map(async (record: DynamoDBRecord) => {
        if (record.eventName == 'MODIFY') {
          const stream: StreamRecord = record.dynamodb || {};
          const { NewImage } = stream;
          if (!NewImage) return;
          const newImage = AWS.DynamoDB.Converter.unmarshall(NewImage) as unknown as CreditReport;
          const metrics = new CreditReportMetrics(newImage);
          const pub = new PubSubUtil();
          pub.createSNSPayload<CreditReportMetrics>('creditreports', 'PUT', metrics, arn, 'creditreportmetrics');
          await pub.publishSNSPayload();
        }
      }),
    );
  } catch (err) {
    console.log('dynamodb error ===> ', err);
  }

  // need an insert check for initial version 0 records
};
