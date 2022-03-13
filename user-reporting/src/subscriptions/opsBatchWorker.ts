import 'reflect-metadata';
import * as nodemailer from 'nodemailer';
import * as enrollmentYTDSchema from 'libs/schema/schema_enrolled-user-report.json';
import dayjs from 'dayjs';
import { safeParse } from 'libs/safeJson';
import { SNS, SES, DynamoDB, CognitoIdentityServiceProvider } from 'aws-sdk';
import { SQSEvent, SQSHandler } from 'aws-lambda';
import { ReportNames } from 'libs/data/reports';
import { PubSubUtil } from 'libs/pubsub/pubsub';
import { getCognitoUsers, getUser } from 'libs/db/cognito';
import { createOpReport } from 'libs/queries/ops-report.queries';
import { IEnrollUserBatchMsg } from 'libs/interfaces/enrolled-user-report.interface';
import { IEmployer, IMergeReport } from 'libs/interfaces/merge-report.interfaces';
import { IAttributeValue, IBatchCognitoMsg, IBatchMsg, IBatchPayload } from 'libs/interfaces/batch.interfaces';
import { parallelScanAppData } from 'libs/db/appdata';
import { parallelScanAPIData } from 'libs/queries/api-transaction.queries';
import { parallelScanReferrals } from 'libs/db/referrals';
import { parallelScanActionData } from 'libs/db/actions';
import { APITransactionLog } from 'libs/models/api-transaction.model';
import { Referral } from 'libs/models/referral.model';
import {
  flattenUser,
  generateEmailParams,
  mapDisputeEnrollmentFields,
  mapEnrollmentFields,
  mapFailedFulfilFields,
  mapSuspendedFields,
} from 'libs/helpers';
import { OpsReportMaker } from 'libs/models/ops-reports';
import { MonthlyLogins } from 'libs/reports/MonthlyLogin/MonthlyLogin';
import { UserAggregateMetrics } from 'libs/reports/UserAggregateMetrics/UserAggregateMetrics';
import { getCurrentReport } from 'libs/queries/CreditReport.queries';
import { NoReportReport } from 'libs/reports/NoReportReport/NoReportReport';
import { MissingDisputeKeysReport } from 'libs/reports/MissingDisputeKeys/MissingDisputeKeysReport';

// request.debug = true; import * as request from 'request';
// const errorLogger = new ErrorLogger();
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
  console.log(`Received ${enrollmentReport.length} creditscoreupdates records `);

  if (enrollmentReport.length) {
    try {
      let counter = 0;
      await Promise.all(
        enrollmentReport.map(async (rec) => {
          const message = rec.message;
          const { exclusiveStartKey: esk, segment, totalSegments } = message;
          console.log('message ==> ', message);
          const scan = await parallelScanAppData(esk, segment, totalSegments);
          await Promise.all(
            scan?.items.map(async (item: any) => {
              const enrolled = item?.agencies?.transunion?.enrolled;
              const enrolledOn = item?.agencies?.transunion?.enrolledOn;
              const inCurrentYear = dayjs(enrolledOn).isAfter(dayjs('2021-11-30'));
              if (enrolled && inCurrentYear) {
                const batchId = dayjs(new Date()).add(-8, 'hours').format('YYYY-MM-DD');
                const schema = enrollmentYTDSchema;
                const record = mapEnrollmentFields(item);
                const ops = new OpsReportMaker(
                  'enrollmentYTD',
                  batchId,
                  JSON.stringify(schema),
                  JSON.stringify(record),
                );
                await createOpReport(ops);
                counter++;
                return true;
              } else {
                return false;
              }
            }),
          );
          // send the data to the query
          // get the next start key.
          if (scan?.lastEvaluatedKey != undefined) {
            const packet: IEnrollUserBatchMsg = {
              exclusiveStartKey: scan.lastEvaluatedKey,
              segment: scan.segment,
              totalSegments: scan.totalSegments,
            };
            const payload = pubsub.createSNSPayload<IEnrollUserBatchMsg>('opsbatch', packet, 'enrollmentreport');
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
      return JSON.stringify({ success: false, error: { error: `Unknown server error=${err}` } });
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
    try {
      let counter = 0;
      await Promise.all(
        failedReport.map(async (rec) => {
          const message = rec.message;
          const { exclusiveStartKey: esk, segment, totalSegments } = message;
          console.log('message ==> ', message);
          const scan = await parallelScanAppData(esk, segment, totalSegments);
          await Promise.all(
            scan?.items.map(async (item: any) => {
              const failed = item?.status === 'suspended';
              const createdAt = item?.createdAt;
              const inCurrentYear = dayjs(createdAt).isAfter(dayjs('2021-11-30'));
              if (failed && inCurrentYear) {
                const batchId = dayjs(new Date()).add(-8, 'hours').format('YYYY-MM-DD');
                const schema = enrollmentYTDSchema;
                const record = mapSuspendedFields(item);
                const ops = new OpsReportMaker(
                  ReportNames.FailureYTD,
                  batchId,
                  JSON.stringify(schema),
                  JSON.stringify(record),
                );
                await createOpReport(ops);
                counter++;
                return true;
              } else {
                return false;
              }
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
            const payload = pubsub.createSNSPayload<IBatchMsg<IAttributeValue>>('opsbatch', packet, 'failurereport');
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
      return JSON.stringify({ success: false, error: { error: `Unknown server error=${err}` } });
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
    try {
      let counter = 0;
      await Promise.all(
        actionsReport.map(async (rec) => {
          const message = rec.message;
          const { exclusiveStartKey: esk, segment, totalSegments } = message;
          console.log('message ==> ', message);
          const scan = await parallelScanActionData(esk, segment, totalSegments);
          await Promise.all(
            scan?.items.map(async (item: any) => {
              const createdOn = item?.createdOn;
              const inCurrentYear = dayjs(createdOn).isAfter(dayjs('2021-11-30'));
              if (inCurrentYear) {
                const batchId = dayjs(new Date()).add(-8, 'hours').format('YYYY-MM-DD');
                const schema = {};
                const record = item;
                const ops = new OpsReportMaker(
                  ReportNames.ActionsYTD,
                  batchId,
                  JSON.stringify(schema),
                  JSON.stringify(record),
                );
                await createOpReport(ops);
                counter++;
                return true;
              } else {
                return false;
              }
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
            const payload = pubsub.createSNSPayload<IBatchMsg<IAttributeValue>>('opsbatch', packet, 'actionsreport');
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
      return JSON.stringify({ success: false, error: { error: `Unknown server error=${err}` } });
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
    try {
      let counter = 0;
      await Promise.all(
        authenticationReport.map(async (rec) => {
          const message = rec.message;
          const { exclusiveStartKey: esk, segment, totalSegments } = message;
          const scan = await parallelScanAPIData(esk, segment, totalSegments);
          await Promise.all(
            scan?.items.map(async (item: any, i: number) => {
              const record = DynamoDB.Converter.unmarshall(item) as unknown as APITransactionLog;
              const isAuth = record.action === 'Enroll:type';
              if (isAuth) {
                const batchId = dayjs(new Date()).add(-8, 'hours').format('YYYY-MM-DD');
                const schema = {};
                const ops = new OpsReportMaker(
                  ReportNames.AuthenticationAll,
                  batchId,
                  JSON.stringify(schema),
                  JSON.stringify(record),
                );
                await createOpReport(ops);
                counter++;
                return true;
              } else {
                return false;
              }
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
            const payload = pubsub.createSNSPayload<IBatchMsg<IAttributeValue>>(
              'opsbatch',
              packet,
              'authenticationcalls',
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
      return JSON.stringify({ success: false, error: { error: `Unknown server error=${err}` } });
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
      return JSON.stringify({ success: false, error: `Unknown server error=${err}` });
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
      return JSON.stringify({ success: false, error: `Unknown server error=${err}` });
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
              const batchId = dayjs(new Date()).add(-8, 'hours').format('YYYY-MM-DD');
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
                  await createOpReport(ops);
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
      return JSON.stringify({ success: false, error: { error: `Unknown server error=${err}` } });
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
    try {
      let counter = 0;
      await Promise.all(
        disputeEnrollmentReport.map(async (rec) => {
          const message = rec.message;
          const { exclusiveStartKey: esk, segment, totalSegments } = message;
          console.log('message ==> ', message);
          const scan = await parallelScanAppData(esk, segment, totalSegments);
          await Promise.all(
            scan?.items.map(async (item: any) => {
              const disputeEnrolled = item?.agencies?.transunion?.disputeEnrolled;
              const disputeEnrolledOn = item?.agencies?.transunion?.disputeEnrolledOn;
              const inCurrentYear = dayjs(disputeEnrolledOn).isAfter(dayjs('2021-11-30'));
              if (disputeEnrolled && inCurrentYear) {
                const batchId = dayjs(new Date()).add(-8, 'hours').format('YYYY-MM-DD');
                const schema = {};
                const record = mapDisputeEnrollmentFields(item);
                const ops = new OpsReportMaker(
                  ReportNames.DisputeEnrollmentYTD,
                  batchId,
                  JSON.stringify(schema),
                  JSON.stringify(record),
                );
                await createOpReport(ops);
                counter++;
                return true;
              } else {
                return false;
              }
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
            const payload = pubsub.createSNSPayload<IBatchMsg<IAttributeValue>>(
              'opsbatch',
              packet,
              'disputeenrollmentreport',
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
      return JSON.stringify({ success: false, error: { error: `Unknown server error=${err}` } });
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
    try {
      let counter = 0;
      const fulfillCalledOn = new Date('2022-03-05');
      await Promise.all(
        failedFulfillReport.map(async (rec) => {
          const message = rec.message;
          const { exclusiveStartKey: esk, segment, totalSegments } = message;
          console.log('message ==> ', message);
          const scan = await parallelScanAppData(esk, segment, totalSegments);
          await Promise.all(
            scan?.items.map(async (item: any) => {
              const enrolled = item.agencies.transunion.enrolled;
              const fulfilledOn = new Date(item.agencies.transunion.fulfilledOn);
              const ranPriorTo = dayjs(fulfilledOn).isBefore(dayjs(fulfillCalledOn));
              if (enrolled && ranPriorTo) {
                const batchId = dayjs(new Date()).add(-8, 'hours').format('YYYY-MM-DD');
                const schema = {};
                const record = mapFailedFulfilFields(item);
                const ops = new OpsReportMaker(
                  ReportNames.FailedFulfillAll,
                  batchId,
                  JSON.stringify(schema),
                  JSON.stringify(record),
                );
                await createOpReport(ops);
                counter++;
                return true;
              } else {
                return false;
              }
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
            const payload = pubsub.createSNSPayload<IBatchMsg<IAttributeValue>>(
              'opsbatch',
              packet,
              'failedfulfillreport',
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
      return JSON.stringify({ success: false, error: { error: `Unknown server error=${err}` } });
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
    try {
      let counter = 0;
      await Promise.all(
        referralsReport.map(async (rec) => {
          const message = rec.message;
          const { exclusiveStartKey: esk, segment, totalSegments } = message;
          console.log('message ==> ', message);
          const scan = await parallelScanReferrals(esk, segment, totalSegments);
          await Promise.all(
            scan?.items.map(async (item: Referral) => {
              const batchId = dayjs(new Date()).add(-8, 'hours').format('YYYY-MM-DD');
              const schema = {};
              let record: Referral = item;
              // 1. only referred users
              if (!record.enrolled) return;
              // 2. if a referredByCode is present, get the id and email of the person
              // if (record.referredByCode && record.referredById) {
              //   try {
              //     const user = await getUser(record.referredById);
              //     console.log('user: ', JSON.stringify(user));
              //     if (!user || !user.UserAttributes) return;
              //     const email = flattenUser(user.UserAttributes, 'email');
              //     record = {
              //       ...record,
              //       referredByEmail: email || '',
              //     };
              //   } catch (err) {
              //     console.log('get reffered by error: ', JSON.stringify(err));
              //     // do nothing
              //   }
              // }

              // 3. get the user emails to add to report
              // let email: string = '';
              // try {
              //   const user = await getUser(record.id);
              //   if (!user || !user.UserAttributes) return;
              //   email = flattenUser(user.UserAttributes, 'email');
              // } catch (err) {
              //   // do nothing
              // }

              // 4. write batch record to opsReport table
              const ops = new OpsReportMaker(
                ReportNames.ReferralsAll,
                batchId,
                JSON.stringify(schema),
                JSON.stringify({
                  ...record,
                  referralEmail: '',
                  referredById: record.referredById || '',
                  referredByEmail: record.referredByEmail || '',
                }),
              );
              await createOpReport(ops);
              counter++;
              return true;
            }),
          );

          // 5. loop if lek still valid
          if (scan?.lastEvaluatedKey != undefined) {
            const packet: IBatchMsg<IAttributeValue> = {
              exclusiveStartKey: scan.lastEvaluatedKey,
              segment: scan.segment,
              totalSegments: scan.totalSegments,
            };
            const payload = pubsub.createSNSPayload<IBatchMsg<IAttributeValue>>('opsbatch', packet, 'referralsreport');
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
      return JSON.stringify({ success: false, error: { error: `Unknown server error=${err}` } });
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

  if (noReportReport.length) {
    const report = new NoReportReport(noReportReport);
    try {
      const results = await report.run();
      return results;
    } catch (err) {
      return JSON.stringify({ success: false, error: `Unknown server error=${err}` });
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

  if (missingDisputeKeys.length) {
    const report = new MissingDisputeKeysReport(missingDisputeKeys);
    try {
      const results = await report.run();
      return results;
    } catch (err) {
      return JSON.stringify({ success: false, error: `Unknown server error=${err}` });
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
                const batchId = dayjs(new Date()).add(-8, 'hours').format('YYYY-MM-DD');
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
                await createOpReport(ops);
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
      return JSON.stringify({ success: false, error: { error: `Unknown server error=${err}` } });
    }
  }
};
