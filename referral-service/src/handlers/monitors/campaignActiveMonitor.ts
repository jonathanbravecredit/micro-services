import { DynamoDBStreamEvent, Handler } from 'aws-lambda';

export const main: Handler = async (event: DynamoDBStreamEvent): Promise<void> => {
  event.Records.forEach((item) => {
    console.log('item ===> ', item);
  });

  // monitors the current campaign pkey = 1, version = 0
  // if the end date has past then it changes the current campaign to default
  // if a new campaign start date has
};
