import "reflect-metadata";
import { Handler } from "aws-lambda";
import { ReportNames } from "libs/data/reports";
import { triggerReport } from "./triggerUtility";

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
  return triggerReport(event, report, 20, process.env.STAGE);
};
