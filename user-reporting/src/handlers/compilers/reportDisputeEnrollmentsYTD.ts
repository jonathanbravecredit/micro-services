import 'reflect-metadata';
const csvjson = require('csvjson');
import * as dayjs from 'dayjs';
import * as nodemailer from 'nodemailer';
import { SES } from 'aws-sdk';
import { Handler } from 'aws-lambda';
import { listOpsReportsByBatch } from 'libs/queries/ops-report.queries';
import { generateEmailParams } from 'libs/helpers';
import { ReportNames } from 'libs/data/reports';
import { IDisputeEnrolledUserReport } from 'libs/interfaces/dispute-enrolled-user-report.interface';

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
export const main: Handler<any, any> = async (event: any): Promise<any> => {
  try {
    const batchId = dayjs(new Date()).add(-7, 'hours').format('YYYY-MM-DD');
    const reportId = ReportNames.DisputeEnrollmentYTD;
    const opsreports = await listOpsReportsByBatch(batchId, reportId);
    if (!opsreports?.length) return;
    console.log(`grabbed ${opsreports.length} records`);
    const enrollments = opsreports.map((report, i) => {
      if (i < 2) {
        console.log('DB record ==> ', report);
      }
      const data: IDisputeEnrolledUserReport = JSON.parse(report.record);
      return data;
    });
    // send an email letting me know which segment is done

    const csvAllData = csvjson.toCSV(JSON.stringify(enrollments), {
      headers: 'key',
    });
    const emails = STAGE === 'dev' ? ['jonathan@brave.credit'] : ['jonathan@brave.credit'];
    let params = generateEmailParams(`disputeEnrollmentYTDReport`, emails);
    params.attachments = [
      {
        filename: 'prodDBReportDisputeEnrollmentsYTD.csv',
        content: csvAllData,
      },
    ];
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
