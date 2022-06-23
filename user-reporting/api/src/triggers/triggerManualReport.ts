import 'reflect-metadata';
import { Handler } from 'aws-lambda';
import { SNS } from 'aws-sdk';
import { PubSubUtil } from 'libs/pubsub/pubsub';
import { IAttributeValue, IBatchMsg } from 'libs/interfaces/batch.interfaces';
import { ReportNames } from 'libs/data/reports';

// request.debug = true; import * as request from 'request';
import { TriggerUtility } from './triggerUtility';
const sns = new SNS({ region: 'us-east-2' });
const pubsub = new PubSubUtil();

/**
 * Handler to manually kick off any report
 * Available Reports:
 * - "actionsreport"
 * - "authenticationcalls"
 * - "disputeanalytics"
 * - "disputeenrollmentreport"
 * - "disputeerrors"
 * - "enrollmentreport"
 * - "failedfulfillreport"
 * - "failurereport"
 * - "missingdisputekeys"
 * - "monthlyloginreport"
 * - "noreportreport"
 * - "referralsreport"
 * - "registeredusersreport"
 * - "usermetricsreport"
 * - "useremployerall"
 * @param event
 * @returns
 */
export const main: Handler<any, any> = async (event: any): Promise<any> => {
  const { report } = event as { report: ReportNames };
  let triggerUtil = new TriggerUtility();
  return triggerUtil.triggerReport(event, report, 20, process.env.STAGE);
};
