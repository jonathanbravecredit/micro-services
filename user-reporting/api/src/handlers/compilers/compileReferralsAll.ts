import 'reflect-metadata';
const csvjson = require('csvjson');
import dayjs from 'dayjs';
import * as nodemailer from 'nodemailer';
import { SES } from 'aws-sdk';
import { Handler } from 'aws-lambda';
import { generateEmailParams } from 'libs/helpers';
import { ReportNames } from 'libs/data/reports';
import { OpsReportQueries } from '@bravecredit/brave-sdk/dist/utils/dynamodb/queries/ops-report.queries';

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
export const main: Handler<{ batchId: string }, any> = async (event: { batchId: string }): Promise<any> => {
  const { batchId } = event;
  try {
    // get the data from the results table
    const batch = batchId ? batchId : dayjs(new Date()).format('YYYY-MM-DD');
    const reportId = ReportNames.ReferralsAll;
    const opsreports = await OpsReportQueries.listOpsReportsByBatch(batch, reportId);
    if (!opsreports?.length) return;

    // create the YTD and new (based on cutoff) data sets
    console.log(`grabbed ${opsreports.length} records`);
    const cutoff = dayjs(new Date()).add(-1, 'days').format('YYYY-MM-DD');
    const referrals = opsreports
      .map((report, i) => {
        if (i < 2) {
          console.log('DB record ==> ', report);
        }
        const data = JSON.parse(report.record);
        return data;
      })
      .map((r) => {
        // order the columns correctly
        return {
          id: r.id,
          referralEmail: r.referralEmail,
          referralCode: r.referralCode,
          referredByCode: r.referredByCode || '',
          referredById: r.referredById || '',
          referredByEmail: r.referredByEmail || '',

          eligible: r.eligible,
          enrolled: r.enrolled,
          suspended: r.suspended,

          totalReferred: r.totalReferred,
          totalEarned: r.totalEarned,
          totalBonus: r.totalBonus,
          totalAddOn: r.totalAddOn,

          campaignActive: r.campaignActive,
          campaignActiveReferred: r.campaignActiveReferred,
          campaignActiveEarned: r.campaignActiveEarned,
          campaignActivePaid: r.campaignActivePaid,
          campaignActiveAddOn: r.campaignActiveAddOn,
          campaignActiveBonus: r.campaignActiveBonus,
          nextPaymentDate: r.nextPaymentDate,
          notified: r.notified,

          campaignPrior: r.campaignPrior,
          campaignPriorReferred: r.campaignPriorReferred,
          campaignPriorEarned: r.campaignPriorPaid,
          campaignPriorPaid: r.campaignPriorPaid,
          campaignPriorAddOn: r.campaignPriorAddOn,
          campaignPriorBonus: r.campaignPriorBonus,

          createdOn: r.createdOn,
          modifiedOn: r.modifiedOn,
        };
      });
    const newReferrals = referrals.filter((e) => {
      return dayjs(e.createdOn).format('YYYY-MM-DD') === cutoff;
    });

    // create the csv files
    const csvAllData = csvjson.toCSV(JSON.stringify(referrals), {
      headers: 'key',
    });
    const csvNewData = csvjson.toCSV(JSON.stringify(newReferrals), {
      headers: 'key',
    });

    // config the emails transporter
    const emails =
      STAGE === 'dev'
        ? ['jonathan@brave.credit']
        : ['jonathan@brave.credit', 'noah@brave.credit', 'jorge@brave.credit'];
    let params = generateEmailParams(`Report: ${ReportNames.ReferralsAll}`, emails);
    params.attachments = [
      {
        filename: `${ReportNames.ReferralsAll}-${batch}.csv`,
        content: csvAllData,
      },
      {
        filename: `${ReportNames.ReferralsAll}-daily-${batch}.csv`,
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
