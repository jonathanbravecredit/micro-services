import 'reflect-metadata';
const csvjson = require('csvjson');
import dayjs from 'dayjs';
import * as nodemailer from 'nodemailer';
import { SES } from 'aws-sdk';
import { Handler } from 'aws-lambda';
import { IEnrolledUserReport } from 'libs/interfaces/enrolled-user-report.interface';
import { listOpsReportsByBatch } from 'libs/queries/ops-report.queries';
import { generateEmailParams } from 'libs/helpers';
import { ReportNames } from 'libs/data/reports';

// request.debug = true; import * as request from 'request';
const ses = new SES({ region: 'us-east-1' });
const STAGE = process.env.STAGE;

/**
 * Handler that processes single requests for Transunion services
 * @param service Service invoked via the SNS Proxy 'transunion'
 * @param command REST based command to invoke actions
 * @param message Object containing service specific package for processing
 * @returns Lambda proxy response
 */
export const main: Handler<any, any> = async (event: { batchId: string }): Promise<any> => {
  const { batchId } = event;
  try {
    // get the data from the results table
    const batch = batchId ? batchId : dayjs(new Date()).format('YYYY-MM-DD');
    const reportId = ReportNames.EnrollmentYTD;
    const opsreports = await listOpsReportsByBatch(batchId, reportId);
    if (!opsreports?.length) return;
    console.log(`grabbed ${opsreports.length} records`);

    // create the YTD and new (based on cutoff) data sets
    const cutoff = dayjs(new Date()).add(-1, 'days').format('YYYY-MM-DD');
    const enrollments = opsreports
      .map((report, i) => {
        if (i < 2) {
          console.log('DB record ==> ', report);
        }
        const data: IEnrolledUserReport = JSON.parse(report.record);
        return data;
      })
      .map((e) => {
        return {
          id: e.id,
          createdAt: e.createdAt,
          createdAtUTC: e.createdAtUTC,
          createdAtPST: e.createdAtPST,
          sortKey: e.sortKey,
          status: e.status,
          statusReason: e.statusReason,
          statusReasonDescription: e.statusReasonDescription,
          enrolled: e.enrolled,
          enrolledOn: e.enrolledOn,
          enrolledOnUTC: e.enrolledOnUTC,
          enrolledOnPST: e.enrolledOnPST,
          fulfilled: e.fulfilled,
          fulfilledOn: e.fulfilledOn,
          fulfilledOnUTC: e.fulfilledOnUTC,
          fulfilledOnPST: e.fulfilledOnPST,
          pinRequests: e.pinRequests,
          pinAttempts: e.pinAttempts,
          pinCurrentAge: e.pinCurrentAge,
          kbaAttempts: e.kbaAttempts,
          kbaCurrentAge: e.kbaCurrentAge,
          authAttempt: e.authAttempt,
        };
      });
    const newEnrollments = enrollments.filter((e) => {
      return dayjs(e.createdAt).format('YYYY-MM-DD') === cutoff;
    });

    // create the csv files
    const csvAllData = csvjson.toCSV(JSON.stringify(enrollments), {
      headers: 'key',
    });
    const csvNewData = csvjson.toCSV(JSON.stringify(newEnrollments), {
      headers: 'key',
    });

    // config the emails transporter
    const emails = STAGE === 'dev' ? ['jonathan@brave.credit'] : ['jonathan@brave.credit', 'jorge@brave.credit'];
    let params = generateEmailParams(`Report: ${ReportNames.EnrollmentYTD}`, emails);
    params.attachments = [
      {
        filename: `${ReportNames.EnrollmentYTD}-${batchId}.csv`,
        content: csvAllData,
      },
      {
        filename: `${ReportNames.EnrollmentYTD}-daily-${batchId}.csv`,
        content: csvNewData,
      },
    ];

    // send the email
    let transporter = nodemailer.createTransport({
      SES: ses,
    });
    await transporter.sendMail(params);
    return;
  } catch (err) {
    console.log('general err ===> ', err);
    return JSON.stringify({ success: false, error: { error: `Unknown server error=${err}` } });
  }
};
