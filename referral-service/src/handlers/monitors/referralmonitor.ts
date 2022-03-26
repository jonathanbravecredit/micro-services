import 'reflect-metadata';
import { DynamoDBStreamEvent, DynamoDBStreamHandler } from 'aws-lambda';
import { ReferralSuspensionManager } from 'libs/utils/managers/referralSuspensionManager';

export const main: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent): Promise<void> => {
  const suspensions = event.Records;
  try {
    await Promise.all(
      suspensions.map(async (r) => {
        const manager = new ReferralSuspensionManager(r);
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
