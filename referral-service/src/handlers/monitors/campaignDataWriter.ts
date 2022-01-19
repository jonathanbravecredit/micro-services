import { DynamoDBStreamEvent, Handler } from 'aws-lambda';
import { getCampaign, updateCurrentCampaign } from 'lib/queries';
import * as moment from 'moment';

export const main: Handler = async (event: DynamoDBStreamEvent): Promise<void> => {
  event.Records.forEach((item) => {
    console.log('item ===> ', item);
  });
};
