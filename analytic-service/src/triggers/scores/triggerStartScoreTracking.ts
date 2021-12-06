'use strict';
import { DynamoDBRecord, DynamoDBStreamEvent, DynamoDBStreamHandler, StreamRecord } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import { ICreditSummary } from 'lib/interfaces/api/creditsummary/creditsummary.interface';
import { CreditScoreMaker } from 'lib/models/credit-scores.model';
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
          const newImage = AWS.DynamoDB.Converter.unmarshall(NewImage) as unknown as ICreditSummary;
          // need to get the current score and then populate the table
          const sub = newImage.userId;
          const scoreId = new Date().valueOf();
          const score = newImage.currentScore || -1;
          const creditScore = new CreditScoreMaker(sub, scoreId, score);
          await createCreditScore(creditScore);
        }
      }),
    );
  } catch (err) {
    console.log('dynamodb error ===> ', err);
  }
};
