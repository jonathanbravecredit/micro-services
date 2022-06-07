import 'reflect-metadata';
import * as nodemailer from 'nodemailer';
import dayjs from 'dayjs';
import { safeParse } from 'libs/safeJson';
import { SNS, SES, CognitoIdentityServiceProvider } from 'aws-sdk';
import { SQSEvent, SQSHandler } from 'aws-lambda';
import { ReportNames } from 'libs/data/reports';
import { PubSubUtil } from 'libs/pubsub/pubsub';
import { getCognitoUsers } from 'libs/db/cognito';
import { IAttributeValue, IBatchCognitoMsg, IBatchMsg, IBatchPayload } from 'libs/interfaces/batch.interfaces';
import { parallelScanAppData } from 'libs/db/appdata';
import { flattenUser, generateEmailParams } from 'libs/helpers';
import { MonthlyLogins } from 'libs/reports/MonthlyLogin/MonthlyLogin';
import { UserAggregateMetrics } from 'libs/reports/UserAggregateMetrics/UserAggregateMetrics';
import { NoReportReport } from 'libs/reports/NoReportReport/NoReportReport';
import { MissingDisputeKeysReport } from 'libs/reports/MissingDisputeKeys/MissingDisputeKeysReport';
import { DisputeErrorsReport } from 'libs/reports/disputeerrors/disputeerrors';
import { DisputeAnalyticsReport } from 'libs/reports/dispute-analytics/dispute-analytics';
import { Enrollment } from 'libs/reports/Enrollment/Enrollment';
import { FailedUsers } from 'libs/reports/FailedUsers/FailedUsers';
import { Actions } from 'libs/reports/Actions/Actions';
import { Authentication } from 'libs/reports/Authentication/Authentication';
import { DisputeEnrollment } from 'libs/reports/DisputeEnrollment/DisputeEnrollment';
import { FailedFulfills } from 'libs/reports/FailedFulfills/FailedFulfills';
import { Referrals } from 'libs/reports/Referrals/Referrals';
import { OpsReportMaker } from '@bravecredit/brave-sdk/dist/models/ops-report/ops-reports';
import { OpsReportQueries } from '@bravecredit/brave-sdk/dist/utils/dynamodb/queries/ops-report.queries';
import { IEmployer, IMergeReport } from '@bravecredit/brave-sdk/dist/types/merge-report';

const ses = new SES({ region: 'us-east-1' });
const sns = new SNS({ region: 'us-east-2' });
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
  //    enrollment report worker
  /*===================================*/
  const enrollmentReport = event.Records.map((r) => {
    return JSON.parse(r.body) as IBatchPayload<IBatchMsg<IAttributeValue>>;
  }).filter((b) => {
    return b.service === 'enrollmentreport';
  });
  console.log(`Received ${enrollmentReport.length} enrollmentreport records `);

  if (enrollmentReport.length) {
    const report = new Enrollment(enrollmentReport);
    try {
      const results = await report.run();
      return results;
    } catch (err) {
      return JSON.stringify({
        success: false,
        error: `Unknown server error=${err}`,
      });
    }
  }

  /*===================================*/
  //    failed users
  /*===================================*/
  const failedReport = event.Records.map((r) => {
    return JSON.parse(r.body) as IBatchPayload<IBatchMsg<IAttributeValue>>;
  }).filter((b) => {
    return b.service === 'failurereport';
  });
  console.log(`Received ${failedReport.length} failure report records `);

  if (failedReport.length) {
    const report = new FailedUsers(failedReport);
    try {
      const results = await report.run();
      return results;
    } catch (err) {
      return JSON.stringify({
        success: false,
        error: `Unknown server error=${err}`,
      });
    }
  }

  /*===================================*/
  //    actions report
  /*===================================*/
  const actionsReport = event.Records.map((r) => {
    return JSON.parse(r.body) as IBatchPayload<IBatchMsg<IAttributeValue>>;
  }).filter((b) => {
    return b.service === 'actionsreport';
  });
  console.log(`Received ${actionsReport.length} actions report records `);

  if (actionsReport.length) {
    const report = new Actions(actionsReport);
    try {
      const results = await report.run();
      return results;
    } catch (err) {
      return JSON.stringify({
        success: false,
        error: `Unknown server error=${err}`,
      });
    }
  }

  /*===================================*/
  //    log authentication report
  /*===================================*/
  const authenticationReport = event.Records.map((r) => {
    return JSON.parse(r.body) as IBatchPayload<IBatchMsg<IAttributeValue>>;
  }).filter((b) => {
    return b.service === 'authenticationcalls';
  });
  console.log(`Received ${authenticationReport.length} authentication report records `);

  if (authenticationReport.length) {
    const report = new Authentication(authenticationReport);
    try {
      const results = await report.run();
      return results;
    } catch (err) {
      return JSON.stringify({
        success: false,
        error: `Unknown server error=${err}`,
      });
    }
  }

  /*===================================*/
  //    monthly login report
  /*===================================*/
  const monthlyLogInReport = event.Records.map((r) => {
    return JSON.parse(r.body) as IBatchPayload<IBatchMsg<IAttributeValue>>;
  }).filter((b) => {
    return b.service === 'monthlyloginreport';
  });
  console.log(`Received ${monthlyLogInReport.length} monthly login report records `);

  if (monthlyLogInReport.length) {
    const report = new MonthlyLogins(monthlyLogInReport);
    try {
      const results = await report.run();
      return results;
    } catch (err) {
      return JSON.stringify({
        success: false,
        error: `Unknown server error=${err}`,
      });
    }
  }

  /*===================================*/
  //    user aggregate metrics report
  /*===================================*/
  const userAggregateMetrics = event.Records.map((r) => {
    return JSON.parse(r.body) as IBatchPayload<IBatchMsg<IAttributeValue>>;
  }).filter((b) => {
    return b.service === 'usermetricsreport';
  });
  console.log(`Received ${userAggregateMetrics.length} user aggregate metrics report records `);

  if (userAggregateMetrics.length) {
    const report = new UserAggregateMetrics(userAggregateMetrics);
    try {
      const results = await report.run();
      return results;
    } catch (err) {
      return JSON.stringify({
        success: false,
        error: `Unknown server error=${err}`,
      });
    }
  }

  /*===================================*/
  //    user employer all
  /*===================================*/
  const userEmployerAll = event.Records.map((r) => {
    return JSON.parse(r.body) as IBatchPayload<IBatchMsg<IAttributeValue>>;
  }).filter((b) => {
    return b.service === 'useremployerall';
  });
  console.log(`Received ${userEmployerAll.length} user employer records `);

  if (userEmployerAll.length) {
    try {
      let counter = 0;
      await Promise.all(
        userEmployerAll.map(async (rec) => {
          const message = rec.message;
          const { exclusiveStartKey: esk, segment, totalSegments } = message;
          console.log('message ==> ', message);
          const scan = await parallelScanAppData(esk, segment, totalSegments);
          await Promise.all(
            scan?.items.map(async (item: any) => {
              //* type is AppData
              const batchId = dayjs(new Date()).add(-5, 'hours').format('YYYY-MM-DD');
              const schema = {};
              const userId = item.id;
              const fulfillMergeReport = item?.agencies?.transunion?.fulfillMergeReport;
              if (!fulfillMergeReport) return false;
              const mergeReport: IMergeReport = safeParse(fulfillMergeReport, 'serviceProductObject');
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
                    JSON.stringify(r),
                  );
                  await OpsReportQueries.createOpReport(ops);
                  counter++;
                }),
              );
              return true;
            }),
          );
          // send the data to the query
          // get the next start key.
          if (scan?.lastEvaluatedKey != undefined) {
            const packet: IBatchMsg<IAttributeValue> = {
              exclusiveStartKey: scan.lastEvaluatedKey,
              segment: scan.segment,
              totalSegments: scan.totalSegments,
            };
            const payload = pubsub.createSNSPayload<IBatchMsg<IAttributeValue>>('opsbatch', packet, 'useremployerall');
            const res = await sns.publish(payload).promise();
            console.log('sns resp ==> ', res);
          } else {
            // send an email letting me know which segment is done
            const emails = STAGE === 'dev' ? ['noah@brave.credit'] : ['noah@brave.credit'];
            let params = generateEmailParams(
              `User Employer segment ${segment} of ${totalSegments} total segments finished`,
              emails,
            );
            let transporter = nodemailer.createTransport({
              SES: ses,
            });
            await transporter.sendMail(params);
          }
        }),
      );
      const results = {
        success: true,
        error: null,
        data: `Ops batch worker successfully processed ${counter} records`,
      };
      console.log(JSON.stringify(results));
      return JSON.stringify(results);
    } catch (err) {
      console.log('error ==> ', err);
      return JSON.stringify({
        success: false,
        error: { error: `Unknown server error=${err}` },
      });
    }
  }

  /*===================================*/
  //    dispute enrollment report
  /*===================================*/
  const disputeEnrollmentReport = event.Records.map((r) => {
    return JSON.parse(r.body) as IBatchPayload<IBatchMsg<IAttributeValue>>;
  }).filter((b) => {
    return b.service === 'disputeenrollmentreport';
  });
  console.log(`Received ${disputeEnrollmentReport.length} dispute enrollment report records `);

  if (disputeEnrollmentReport.length) {
    const report = new DisputeEnrollment(disputeEnrollmentReport);
    try {
      const results = await report.run();
      return results;
    } catch (err) {
      return JSON.stringify({
        success: false,
        error: `Unknown server error=${err}`,
      });
    }
  }

  /*===================================*/
  //    dispute analytics report
  /*===================================*/
  const disputeAnalyticReport = event.Records.map((r) => {
    return JSON.parse(r.body) as IBatchPayload<IBatchMsg<IAttributeValue>>;
  }).filter((b) => {
    return b.service === ReportNames.DisputeAnalytics;
  });
  console.log(`Received ${disputeAnalyticReport.length} dispute analytic report records `);

  if (disputeAnalyticReport.length) {
    const report = new DisputeAnalyticsReport(disputeAnalyticReport);
    try {
      const results = await report.run();
      return results;
    } catch (err) {
      return JSON.stringify({
        success: false,
        error: `Unknown server error=${err}`,
      });
    }
  }

  /*===================================*/
  //    failed fulfills report
  /*===================================*/
  const failedFulfillReport = event.Records.map((r) => {
    return JSON.parse(r.body) as IBatchPayload<IBatchMsg<IAttributeValue>>;
  }).filter((b) => {
    return b.service === 'failedfulfillreport';
  });
  console.log(`Received ${failedFulfillReport.length} failed fulfill report records `);

  if (failedFulfillReport.length) {
    const report = new FailedFulfills(failedFulfillReport);
    try {
      const results = await report.run();
      return results;
    } catch (err) {
      return JSON.stringify({
        success: false,
        error: `Unknown server error=${err}`,
      });
    }
  }

  /*===================================*/
  //    referrals report
  /*===================================*/
  const referralsReport = event.Records.map((r) => {
    return JSON.parse(r.body) as IBatchPayload<IBatchMsg<IAttributeValue>>;
  }).filter((b) => {
    return b.service === 'referralsreport';
  });
  console.log(`Received ${referralsReport.length} referrals report records `);

  if (referralsReport.length) {
    const report = new Referrals(referralsReport);
    try {
      const results = await report.run();
      return results;
    } catch (err) {
      return JSON.stringify({
        success: false,
        error: `Unknown server error=${err}`,
      });
    }
  }

  /*===================================*/
  //    no report report
  /*===================================*/

  const noReportReport = event.Records.map((r) => {
    return JSON.parse(r.body) as IBatchPayload<IBatchMsg<IAttributeValue>>;
  }).filter((b) => {
    return b.service === ReportNames.NoReportReport;
  });
  console.log(`Received ${noReportReport.length} NoReport report records `);

  if (noReportReport.length) {
    const report = new NoReportReport(noReportReport);
    try {
      const results = await report.run();
      return results;
    } catch (err) {
      return JSON.stringify({
        success: false,
        error: `Unknown server error=${err}`,
      });
    }
  }

  /*===================================*/
  //    missing dispute keys
  /*===================================*/
  const missingDisputeKeys = event.Records.map((r) => {
    return JSON.parse(r.body) as IBatchPayload<IBatchMsg<IAttributeValue>>;
  }).filter((b) => {
    return b.service === ReportNames.MissingDisputeKeys;
  });
  console.log(`Received ${missingDisputeKeys.length} missing dispute keys report records `);

  if (missingDisputeKeys.length) {
    const report = new MissingDisputeKeysReport(missingDisputeKeys);
    try {
      const results = await report.run();
      return results;
    } catch (err) {
      return JSON.stringify({
        success: false,
        error: `Unknown server error=${err}`,
      });
    }
  }

  /*===================================*/
  //    disputeErrors
  /*===================================*/
  const disputeErrors = event.Records.map((r) => {
    return JSON.parse(r.body) as IBatchPayload<IBatchMsg<IAttributeValue>>;
  }).filter((b) => {
    return b.service === ReportNames.DisputeErrors;
  });
  console.log(`Received ${disputeErrors.length} dispute errors report records `);

  if (disputeErrors.length) {
    const report = new DisputeErrorsReport(disputeErrors);
    try {
      const results = await report.run();
      return results;
    } catch (err) {
      return JSON.stringify({
        success: false,
        error: `Unknown server error=${err}`,
      });
    }
  }

  /*===================================*/
  //    registration report
  //  !!!DISABLED!!!
  /*===================================*/
  const registrationReport = event.Records.map((r) => {
    return JSON.parse(r.body) as IBatchPayload<IBatchCognitoMsg<string>>;
  }).filter((b) => {
    return b.service === 'registeredusersreport';
  });
  console.log(`Received ${registrationReport.length} registration report records `);

  if (registrationReport.length) {
    try {
      let counter = 0;
      await Promise.all(
        registrationReport.map(async (rec) => {
          const message = rec.message;
          const { exclusiveStartKey: esk, segment, totalSegments } = message;
          console.log('message ==> ', message);
          const scan: CognitoIdentityServiceProvider.ListUsersResponse = await getCognitoUsers(esk || '', 60);
          if (scan && scan.Users) {
            await Promise.all(
              scan.Users.map(async (item: CognitoIdentityServiceProvider.UserType) => {
                const batchId = dayjs(new Date()).add(-5, 'hours').format('YYYY-MM-DD');
                const newYear = dayjs('2022-01-01');
                const created = dayjs(item.UserCreateDate);
                const test = created.isAfter(newYear);
                if (!test) return false;
                const schema = {};
                const attrs = {
                  sub: flattenUser(item.Attributes as { Name: string; Value: string }[], 'sub'),
                  email: flattenUser(item.Attributes as { Name: string; Value: string }[], 'email'),
                  email_verified: flattenUser(item.Attributes as { Name: string; Value: string }[], 'email_verified'),
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
                  JSON.stringify(mapped),
                );
                await OpsReportQueries.createOpReport(ops);
                counter++;
                return true;
              }),
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
            console.log('packet: ', packet);
            const payload = pubsub.createSNSPayload<IBatchCognitoMsg<string>>(
              'opsbatch',
              packet,
              'registeredusersreport',
            );
            const res = await sns.publish(payload).promise();
            console.log('sns resp ==> ', res);
          }
        }),
      );
      const results = {
        success: true,
        error: null,
        data: `Ops batch worker successfully processed ${counter} records`,
      };
      console.log(JSON.stringify(results));
      return JSON.stringify(results);
    } catch (err) {
      console.log('error ==> ', err);
      return JSON.stringify({
        success: false,
        error: { error: `Unknown server error=${err}` },
      });
    }
  }
};
