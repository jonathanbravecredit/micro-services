import { SNSEvent, SNSHandler } from 'aws-lambda';

export const main: SNSHandler = async (event: SNSEvent): Promise<void> => {
  const records = event.Records;
  records.forEach((r) => {
    console.log('referral active monitor record: ', JSON.stringify(r));
  });
};
