'use strict';
import { DynamoDBRecord, DynamoDBStreamEvent, DynamoDBStreamHandler, StreamRecord } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import { IAppData } from 'lib/interfaces/api/appdata/appdata.interface';
import { Analytics } from 'lib/models/analytics.model';
import { CreditScoreMaker } from 'lib/models/credit-scores.model';
import { getItemsInDB } from 'lib/queries/appdata/appdata';
import { createCreditScore } from 'lib/queries/creditscores/creditscores.queries';

export const main: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent): Promise<void> => {
  const records = event.Records;
  console.log('records ==> ', JSON.stringify(records));
  // mailchimp emails
  try {
    await Promise.all(
      records.map(async (record: DynamoDBRecord) => {
        if (record.eventName == 'INSERT') {
          const stream: StreamRecord = record.dynamodb || {};
          const { OldImage, NewImage } = stream;
          if (!NewImage) return;
          const newImage = AWS.DynamoDB.Converter.unmarshall(NewImage) as unknown as Analytics;
          if (
            (!OldImage && newImage.event === 'dashboard_product') ||
            newImage.event === 'creditmix_product_recommendation' ||
            newImage.event === 'dispute_investigation_results'
          ) {
            // need to get the current score and then populate the table
            const sub = newImage.sub;
            const scoreId = new Date().valueOf();
            const data: IAppData = await getItemsInDB(sub);
            const prodObj = data.agencies.transunion.fulfillVantageScore.serviceProductObject;
            // .serviceProductValue || null;
            let vantageScore: {
              serviceProductValue: string | number;
            } = typeof prodObj === 'string' ? JSON.parse(prodObj) : prodObj;
            const riskScore = +vantageScore.serviceProductValue;
            if (!sub || !riskScore) return;
            const creditScore = new CreditScoreMaker(sub, scoreId, riskScore);
            await createCreditScore(creditScore);
          }
        }
      }),
    );
  } catch (err) {
    console.log('dynamodb error ===> ', err);
  }
};
