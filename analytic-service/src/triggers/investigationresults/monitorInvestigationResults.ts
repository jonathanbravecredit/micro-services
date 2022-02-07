'use strict';
import { DynamoDBRecord, DynamoDBStreamEvent, DynamoDBStreamHandler, StreamRecord } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { AnalyticsMaker } from 'lib/models/analytics.model';
import { InvestigationResult } from 'lib/models/investigation-results.model';
import { createAnalytics } from 'lib/queries';
import { v4 } from 'uuid';

export const main: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent): Promise<void> => {
  const records = event.Records;
  const inserts = records.filter((r) => r.eventName === 'INSERT');
  console.log('records ==> ', JSON.stringify(records));
  // mailchimp emails
  try {
    await Promise.all(
      inserts.map(async (record: DynamoDBRecord) => {
        try {
          const stream: StreamRecord = record.dynamodb || {};
          const { NewImage } = stream;
          if (!NewImage) return;
          const newImage = DynamoDB.Converter.unmarshall(NewImage) as unknown as InvestigationResult;
          const { userId } = newImage;
          const session = v4();
          const analytic = new AnalyticsMaker(
            userId,
            'new_investigation_results_ready',
            userId,
            session,
            'agency_service',
          );
          await createAnalytics(analytic);
        } catch (err) {
          console.log('error creating IR analytic: ', JSON.stringify(err));
        }
      }),
    );
  } catch (err) {
    console.log('dynamodb error ==> ', err);
  }
};
