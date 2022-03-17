import { Handler, ScheduledHandler } from 'aws-lambda';

export const main: Handler<any, any> = async (event: ScheduledHandler): Promise<void> => {
  // I need to get all the suspended accounts
  // check the reason for the suspension
  // check if the window for the suspension has passed
  // reset the status to active
};
