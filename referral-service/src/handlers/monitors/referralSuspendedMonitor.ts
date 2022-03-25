import 'reflect-metadata';
import { DynamoDBStreamEvent, DynamoDBStreamHandler } from 'aws-lambda';
import { ReferralManager } from 'libs/utils/managers/referralManager';

export const main: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent): Promise<void> => {
  /*============================================*/
  //      SUSPENSION UPDATES
  /*============================================*/
  const suspensions = event.Records;
  try {
    await Promise.all(
      suspensions.map(async (r) => {
        const manager = new ReferralManager(r);
        try {
          await manager.handleSuspensions();
        } catch (err) {
          console.error(err);
        }
      }),
    );
  } catch (err) {
    console.error(err);
  }
};
