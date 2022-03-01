import 'reflect-metadata';
const csvjson = require('csvjson');
import * as dayjs from 'dayjs';
import * as nodemailer from 'nodemailer';
import { SES } from 'aws-sdk';
import { Handler } from 'aws-lambda';
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
export const main: Handler<any, any> = async (event: any): Promise<any> => {
  try {
    // get the data from the results table
    const batchId = dayjs(new Date()).add(-8, 'hours').format('YYYY-MM-DD');
    const reportId = ReportNames.RegistrationsYTD;
    const opsreports = await listOpsReportsByBatch(batchId, reportId);
    if (!opsreports?.length) return;

    // create the YTD and new (based on cutoff) data sets
    console.log(`grabbed ${opsreports.length} records`);
    const registrations = opsreports.map((report, i) => {
      if (i < 2) {
        console.log('DB record ==> ', report);
      }
      const data = JSON.parse(report.record);
      return {
        userName: data.userName,
        userCreateDate: data.userCreateDate,
        enabled: data.enabled,
        userStatus: data.userStatus,
        sub: data.sub,
        email: data.email,
        emailVerified: data.email_verified,
      };
    });

    // create the csv files
    const csvAllData = csvjson.toCSV(JSON.stringify(registrations), {
      headers: 'key',
    });
    // config the emails transporter
    const emails = STAGE === 'dev' ? ['jonathan@brave.credit'] : ['jonathan@brave.credit', 'jorge@brave.credit'];
    let params = generateEmailParams(`Registration Report(s)`, emails);
    params.attachments = [
      {
        filename: `registration-YTD-${batchId}.csv`,
        content: csvAllData,
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
