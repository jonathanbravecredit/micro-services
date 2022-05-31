import 'reflect-metadata';
import { Handler } from 'aws-lambda';
import { SNS } from 'aws-sdk';
import { PubSubUtil } from 'libs/pubsub/pubsub';
import { IAttributeValue, IBatchMsg } from 'libs/interfaces/batch.interfaces';
import { ReportNames } from 'libs/data/reports';

// request.debug = true; import * as request from 'request';
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
  if (!report) throw `No report provided:${report}`;
  try {
    let counter = 0;
    const segments = [];
    for (let i = 0; i < 20; i++) {
      segments.push(i);
    }
    await Promise.all(
      segments.map(async (s) => {
        const packet: IBatchMsg<IAttributeValue> = {
          exclusiveStartKey: undefined,
          segment: s,
          totalSegments: segments.length,
        };
        const payload = pubsub.createSNSPayload<IBatchMsg<IAttributeValue>>('opsbatch', packet, report);
        await sns.publish(payload).promise();
      }),
    );
    const results = { success: true, error: null, data: `Ops:batch queued ${counter} records.` };
    return JSON.stringify(results);
  } catch (err) {
    console.log('err ===> ', err);
    return JSON.stringify({ success: false, error: { error: `Unknown server error=${err}` } });
  }
};
