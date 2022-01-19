import { DynamoDBStreamEvent, Handler } from 'aws-lambda';

export const main: Handler = async (event: DynamoDBStreamEvent): Promise<void> => {
  event.Records.forEach((item) => {
    console.log('item ===> ', item);
  });
  // set up rules
};
