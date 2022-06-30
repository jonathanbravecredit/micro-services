'use strict';
import * as AWS from 'aws-sdk';
import { DynamoDBRecord, DynamoDBStreamEvent, DynamoDBStreamHandler, StreamRecord } from 'aws-lambda';
import { ExtendedMetrics } from 'libs/models/extended-metrics';
import { IExtendedMetrics } from 'libs/interfaces/extended-metrics';
import { CreditReport, PubSubUtil } from '@bravecredit/brave-sdk';

export const main: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent): Promise<void> => {
  const arn = process.env.CREDIT_REPORT_METRICS_SNS_TOPIC || '';
  const records = event.Records;
  // mailchimp emails
  console.log('arn', arn);
  try {
    await Promise.all(
      records.map(async (record: DynamoDBRecord) => {
        if (record.eventName == 'MODIFY') {
          const stream: StreamRecord = record.dynamodb || {};
          const { NewImage } = stream;
          if (!NewImage) return;
          const newImage = AWS.DynamoDB.Converter.unmarshall(NewImage) as unknown as CreditReport;
          const analysis = new ExtendedMetrics(newImage);
          analysis.aggregate();
          const { id, metrics } = analysis;
          if (!id || !metrics) return;
          console.log('id: ', id);
          console.log('metrics: ', metrics);
          const pub = new PubSubUtil();
          pub.createSNSPayload<{ id: string; metrics: IExtendedMetrics }>(
            'creditreports',
            { id, metrics },
            'creditreportmetrics',
            arn,
          );
          await pub.publishSNSPayload();
        }

        if (record.eventName == 'INSERT') {
          const stream: StreamRecord = record.dynamodb || {};
          const { NewImage } = stream;
          if (!NewImage) return;
          const newImage = AWS.DynamoDB.Converter.unmarshall(NewImage) as unknown as CreditReport;
          if (newImage.version !== 0) return;
          const analysis = new ExtendedMetrics(newImage);
          analysis.aggregate();
          const { id, metrics } = analysis;
          if (!id || !metrics) return;
          console.log('id: ', id);
          console.log('metrics: ', metrics);
          const pub = new PubSubUtil();
          pub.createSNSPayload<{ id: string; metrics: IExtendedMetrics }>(
            'creditreports',
            { id, metrics },
            'creditreportmetrics',
            arn,
          );
          await pub.publishSNSPayload();
        }
      }),
    );
  } catch (err) {
    console.log('dynamodb error ===> ', err);
  }

  // need an insert check for initial version 0 records
};
