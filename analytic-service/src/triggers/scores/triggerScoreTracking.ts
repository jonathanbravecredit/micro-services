'use strict';
import { DynamoDBRecord, DynamoDBStreamEvent, DynamoDBStreamHandler, StreamRecord } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { ICreditSummary } from 'lib/interfaces/api/creditsummary/creditsummary.interface';
import { CreditScoreMaker } from 'lib/models/credit-scores.model';
import { createCreditScore } from 'lib/queries';

export const main: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent): Promise<void> => {
  const records = event.Records;
  console.log('records ==> ', JSON.stringify(records));
  // mailchimp emails
  try {
    await Promise.all(
      records.map(async (record: DynamoDBRecord) => {
        if (record.eventName == 'MODIFY' || record.eventName === 'INSERT') {
          const stream: StreamRecord = record.dynamodb || {};
          const { NewImage } = stream;
          if (!NewImage) return;
          const newImage = DynamoDB.Converter.unmarshall(NewImage) as unknown as ICreditSummary;
          const sub = newImage.userId;
          const scoreId = new Date().valueOf();
          const bureauId = newImage.bureauId;
          const score = newImage.currentScore || -1;
          const source = 'fulfill:unknown'; // could look at the logs and determine
          const creditScore = new CreditScoreMaker(sub, scoreId, bureauId, score, source);
          console.log('credit score ==> ', creditScore);
          await createCreditScore(creditScore);
        }
      }),
    );
  } catch (err) {
    console.log('dynamodb error ==> ', err);
  }
};
