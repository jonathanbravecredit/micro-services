import 'reflect-metadata';
const csvjson = require('csvjson');
import dayjs from 'dayjs';
import * as nodemailer from 'nodemailer';
import { SES } from 'aws-sdk';
import { Handler } from 'aws-lambda';
import { generateEmailParams } from 'libs/helpers';
import { ReportNames } from 'libs/data/reports';
import { DuplicateFulfillsRunner } from 'libs/reports/duplicatefulfills/duplicatefulfills';

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
    const runner = new DuplicateFulfillsRunner();
    await runner.run();
    const duplicates = runner.results;

    // create the csv files
    const csvAllData = csvjson.toCSV(JSON.stringify(duplicates), {
      headers: 'key',
    });

    // config the emails transporter
    const emails = STAGE === 'dev' ? ['jonathan@brave.credit'] : ['jonathan@brave.credit'];
    let params = generateEmailParams(`Report: ${ReportNames.DuplicateReports}`, emails);
    params.attachments = [
      {
        filename: `${ReportNames.EnrollmentYTD}-${batch}.csv`,
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
    console.error(err);
  }
};
