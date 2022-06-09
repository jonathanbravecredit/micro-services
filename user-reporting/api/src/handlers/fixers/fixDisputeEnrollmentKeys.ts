import { Handler } from 'aws-lambda';
import { FixDisputeEnrollmentKeyRunner } from 'libs/runners/fixDisputeEnrollmentKeyRunner';

export interface FixDisputeEnrollmentKey {
  id: string;
  disputeEnrolledOn: string;
  disputeEnrollmentKey: string;
  disputeServiceBundleFulfillmentKey: string;
}

export interface FixDisputeEnrollmentKeyEvent {
  list: FixDisputeEnrollmentKey[];
}

export const main: Handler<FixDisputeEnrollmentKeyEvent, void> = async (
  event: FixDisputeEnrollmentKeyEvent,
): Promise<void> => {
  const runner = new FixDisputeEnrollmentKeyRunner(event);
  try {
    await runner.run();
  } catch (err) {
    console.log('error: ', err);
  }
};
