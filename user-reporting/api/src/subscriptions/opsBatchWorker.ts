import "reflect-metadata";
import * as nodemailer from "nodemailer";
import dayjs from "dayjs";
import { safeParse } from "libs/safeJson";
import { SNS, SES, CognitoIdentityServiceProvider } from "aws-sdk";
import { SQSEvent, SQSHandler } from "aws-lambda";
import { ReportNames } from "libs/data/reports";
import { PubSubUtil } from "libs/pubsub/pubsub";
import { getCognitoUsers } from "libs/db/cognito";
import { IAttributeValue, IBatchCognitoMsg, IBatchMsg, IBatchPayload } from "libs/interfaces/batch.interfaces";
import { flattenUser, generateEmailParams } from "libs/helpers";
import { MonthlyLogins } from "libs/reports/MonthlyLogin/MonthlyLogin";
import { UserAggregateMetrics } from "libs/reports/UserAggregateMetrics/UserAggregateMetrics";
import { NoReportReport } from "libs/reports/NoReportReport/NoReportReport";
import { MissingDisputeKeysReport } from "libs/reports/MissingDisputeKeys/MissingDisputeKeysReport";
import { DisputeErrorsReport } from "libs/reports/disputeerrors/disputeerrors";
import { DisputeAnalyticsReport } from "libs/reports/dispute-analytics/dispute-analytics";
import { Enrollment } from "libs/reports/Enrollment/Enrollment";
import { FailedUsers } from "libs/reports/FailedUsers/FailedUsers";
import { Actions } from "libs/reports/Actions/Actions";
import { Authentication } from "libs/reports/Authentication/Authentication";
import { DisputeEnrollment } from "libs/reports/DisputeEnrollment/DisputeEnrollment";
import { FailedFulfills } from "libs/reports/FailedFulfills/FailedFulfills";
import { Referrals } from "libs/reports/Referrals/Referrals";
import { OpsReportMaker } from "@bravecredit/brave-sdk/dist/models/ops-report/ops-reports";
import { OpsReportQueries } from "@bravecredit/brave-sdk/dist/utils/dynamodb/queries/ops-report.queries";
import { IEmployer, IMergeReport } from "@bravecredit/brave-sdk/dist/types/merge-report";
import { WaitlistReport } from "libs/reports/Waitlist/waitlist";
import { opsBatchWorkerUtil } from "./opsBatchWorkerUtil";
import { parallelScan } from '../../libs/db/parallelScanUtil';

const ses = new SES({ region: "us-east-1" });
const sns = new SNS({ region: "us-east-2" });
const pubsub = new PubSubUtil();
const STAGE = process.env.STAGE;

/**
 * Handler that processes report batch request in parallel
 * @param service Service invoked via the SNS Proxy 'transunion'
 * @param command REST based command to invoke actions
 * @param message Object containing service specific package for processing
 * @returns Lambda proxy response
 */
export const main: SQSHandler = async (event: SQSEvent): Promise<any> => {
  /*===================================*/
  //    waitlist report worker
  /*===================================*/

  let waitlistRes = await opsBatchWorkerUtil(ReportNames.WaitlistAnalytics, WaitlistReport, event);
  if (waitlistRes) {
    return waitlistRes;
  }

  /*===================================*/
  //    enrollment report worker
  /*===================================*/

  let enrollmentRes = await opsBatchWorkerUtil("enrollmentreport", Enrollment, event);
  if (enrollmentRes) {
    return enrollmentRes;
  }

  /*===================================*/
  //    failed users
  /*===================================*/

  let failedUsersRes = await opsBatchWorkerUtil("failurereport", FailedUsers, event);
  if (failedUsersRes) {
    return failedUsersRes;
  }

  /*===================================*/
  //    actions report
  /*===================================*/

  let actionsRes = await opsBatchWorkerUtil("actionsreport", Actions, event);
  if (actionsRes) {
    return actionsRes;
  }

  /*===================================*/
  //    log authentication report
  /*===================================*/

  let authenticationRes = await opsBatchWorkerUtil("authenticationcalls", Authentication, event);
  if (authenticationRes) {
    return authenticationRes;
  }

  /*===================================*/
  //    monthly login report
  /*===================================*/

  let monthlyLoginRes = await opsBatchWorkerUtil("monthlyloginreport", MonthlyLogins, event);
  if (monthlyLoginRes) {
    return monthlyLoginRes;
  }

  /*===================================*/
  //    user aggregate metrics report
  /*===================================*/

  let userAggregateMetricsRes = await opsBatchWorkerUtil("usermetricsreport", UserAggregateMetrics, event);
  if (userAggregateMetricsRes) {
    return userAggregateMetricsRes;
  }

  /*===================================*/
  //    user employer all
  /*===================================*/
  const userEmployerAll = event.Records.map((r) => {
    return JSON.parse(r.body) as IBatchPayload<IBatchMsg<IAttributeValue>>;
  }).filter((b) => {
    return b.service === "useremployerall";
  });
  console.log(`Received ${userEmployerAll.length} user employer records `);

  if (userEmployerAll.length) {
    try {
      let counter = 0;
      await Promise.all(
        userEmployerAll.map(async (rec) => {
          const message = rec.message;
          const { exclusiveStartKey: esk, segment, totalSegments } = message;
          console.log("message ==> ", message);
          const scan = await parallelScan(esk, segment, totalSegments, process.env.APPDATA);
          await Promise.all(
            scan?.items.map(async (item: any) => {
              //* type is AppData
              const batchId = dayjs(new Date()).add(-5, "hours").format("YYYY-MM-DD");
              const schema = {};
              const userId = item.id;
              const fulfillMergeReport = item?.agencies?.transunion?.fulfillMergeReport;
              if (!fulfillMergeReport) return false;
              const mergeReport: IMergeReport = safeParse(fulfillMergeReport, "serviceProductObject");
              if (!mergeReport) return false;

              let employers =
                mergeReport.TrueLinkCreditReportType?.Borrower?.Employer instanceof Array
                  ? mergeReport.TrueLinkCreditReportType?.Borrower?.Employer
                  : [mergeReport.TrueLinkCreditReportType?.Borrower?.Employer];

              if (!employers) return;

              const report = (employers.filter(Boolean) as IEmployer[]).map((employer: IEmployer) => {
                return {
                  userId: userId,
                  employerName: employer.name,
                  city: employer.CreditAddress?.city,
                  state: employer.CreditAddress?.stateCode,
                  country: employer.CreditAddress?.country,
                  abbreviation: employer.Source?.Bureau?.abbreviation,
                  partitionSet: employer.partitionSet,
                  dateReported: employer.dateReported,
                  dateUpdated: employer.dateUpdated,
                  fufilledOn: item?.agencies?.transunion?.fulfilledOn,
                };
              });

              await Promise.all(
                report.map(async (r: any) => {
                  const ops = new OpsReportMaker(
                    ReportNames.UserEmployerAll,
                    batchId,
                    JSON.stringify(schema),
                    JSON.stringify(r)
                  );
                  await OpsReportQueries.createOpReport(ops);
                  counter++;
                })
              );
              return true;
            })
          );
          // send the data to the query
          // get the next start key.
          if (scan?.lastEvaluatedKey != undefined) {
            const packet: IBatchMsg<IAttributeValue> = {
              exclusiveStartKey: scan.lastEvaluatedKey,
              segment: scan.segment,
              totalSegments: scan.totalSegments,
            };
            const payload = pubsub.createSNSPayload<IBatchMsg<IAttributeValue>>("opsbatch", packet, "useremployerall");
            const res = await sns.publish(payload).promise();
            console.log("sns resp ==> ", res);
          } else {
            // send an email letting me know which segment is done
            const emails = STAGE === "dev" ? ["noah@brave.credit"] : ["noah@brave.credit"];
            let params = generateEmailParams(
              `User Employer segment ${segment} of ${totalSegments} total segments finished`,
              emails
            );
            let transporter = nodemailer.createTransport({
              SES: ses,
            });
            await transporter.sendMail(params);
          }
        })
      );
      const results = {
        success: true,
        error: null,
        data: `Ops batch worker successfully processed ${counter} records`,
      };
      console.log(JSON.stringify(results));
      return JSON.stringify(results);
    } catch (err) {
      console.log("error ==> ", err);
      return JSON.stringify({
        success: false,
        error: { error: `Unknown server error=${err}` },
      });
    }
  }

  /*===================================*/
  //    dispute enrollment report
  /*===================================*/

  let disputeEnrollmentRes = await opsBatchWorkerUtil("disputeenrollmentreport", DisputeEnrollment, event);
  if (disputeEnrollmentRes) {
    return disputeEnrollmentRes;
  }

  /*===================================*/
  //    dispute analytics report
  /*===================================*/

  let disputeAnalyticRes = await opsBatchWorkerUtil(ReportNames.DisputeAnalytics, DisputeAnalyticsReport, event);
  if (disputeAnalyticRes) {
    return disputeAnalyticRes;
  }

  /*===================================*/
  //    failed fulfills report
  /*===================================*/

  let failedFulfillRes = await opsBatchWorkerUtil("failedfulfillreport", FailedFulfills, event);
  if (failedFulfillRes) {
    return failedFulfillRes;
  }

  /*===================================*/
  //    referrals report
  /*===================================*/

  let referralsRes = await opsBatchWorkerUtil("referralsreport", Referrals, event);
  if (referralsRes) {
    return referralsRes;
  }

  /*===================================*/
  //    no report report
  /*===================================*/

  let noReportRes = await opsBatchWorkerUtil(ReportNames.NoReportReport, NoReportReport, event);
  if (noReportRes) {
    return noReportRes;
  }

  /*===================================*/
  //    missing dispute keys
  /*===================================*/

  let missingDisputeRes = await opsBatchWorkerUtil(ReportNames.MissingDisputeKeys, MissingDisputeKeysReport, event);
  if (missingDisputeRes) {
    return missingDisputeRes;
  }

  /*===================================*/
  //    disputeErrors
  /*===================================*/

  let disputeErrorsRes = await opsBatchWorkerUtil(ReportNames.DisputeErrors, DisputeErrorsReport, event);
  if (disputeErrorsRes) {
    return disputeErrorsRes;
  }

  /*===================================*/
  //    registration report
  //  !!!DISABLED!!!
  /*===================================*/
  const registrationReport = event.Records.map((r) => {
    return JSON.parse(r.body) as IBatchPayload<IBatchCognitoMsg<string>>;
  }).filter((b) => {
    return b.service === "registeredusersreport";
  });
  console.log(`Received ${registrationReport.length} registration report records `);

  if (registrationReport.length) {
    try {
      let counter = 0;
      await Promise.all(
        registrationReport.map(async (rec) => {
          const message = rec.message;
          const { exclusiveStartKey: esk, segment, totalSegments } = message;
          console.log("message ==> ", message);
          const scan: CognitoIdentityServiceProvider.ListUsersResponse = await getCognitoUsers(esk || "", 60);
          if (scan && scan.Users) {
            await Promise.all(
              scan.Users.map(async (item: CognitoIdentityServiceProvider.UserType) => {
                const batchId = dayjs(new Date()).add(-5, "hours").format("YYYY-MM-DD");
                const newYear = dayjs("2022-01-01");
                const created = dayjs(item.UserCreateDate);
                const test = created.isAfter(newYear);
                if (!test) return false;
                const schema = {};
                const attrs = {
                  sub: flattenUser(item.Attributes as { Name: string; Value: string }[], "sub"),
                  email: flattenUser(item.Attributes as { Name: string; Value: string }[], "email"),
                  email_verified: flattenUser(item.Attributes as { Name: string; Value: string }[], "email_verified"),
                };
                const mapped = {
                  userName: item.Username,
                  userCreateDate: item.UserCreateDate?.toISOString(),
                  enabled: item.Enabled,
                  userStatus: item.UserStatus,
                  ...attrs,
                };

                const ops = new OpsReportMaker(
                  ReportNames.RegistrationsYTD,
                  batchId,
                  JSON.stringify(schema),
                  JSON.stringify(mapped)
                );
                await OpsReportQueries.createOpReport(ops);
                counter++;
                return true;
              })
            );
          }
          // send the data to the query
          // get the next start key.
          if (scan?.PaginationToken != undefined && scan?.PaginationToken !== null) {
            const packet: IBatchCognitoMsg<string> = {
              exclusiveStartKey: scan.PaginationToken,
              segment: 0,
              totalSegments: 1,
            };
            console.log("packet: ", packet);
            const payload = pubsub.createSNSPayload<IBatchCognitoMsg<string>>(
              "opsbatch",
              packet,
              "registeredusersreport"
            );
            const res = await sns.publish(payload).promise();
            console.log("sns resp ==> ", res);
          }
        })
      );
      const results = {
        success: true,
        error: null,
        data: `Ops batch worker successfully processed ${counter} records`,
      };
      console.log(JSON.stringify(results));
      return JSON.stringify(results);
    } catch (err) {
      console.log("error ==> ", err);
      return JSON.stringify({
        success: false,
        error: { error: `Unknown server error=${err}` },
      });
    }
  }
};
