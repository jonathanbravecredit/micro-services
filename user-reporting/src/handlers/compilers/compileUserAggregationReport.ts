import 'reflect-metadata';
const csvjson = require('csvjson');
import dayjs from 'dayjs';
import * as nodemailer from 'nodemailer';
import { SES } from 'aws-sdk';
import { Handler } from 'aws-lambda';
import { listOpsReportsByBatch } from 'libs/queries/ops-report.queries';
import { generateEmailParams } from 'libs/helpers';
import { ReportNames } from 'libs/data/reports';
import { IUserSummaryMappedValues } from 'libs/interfaces/user-summary.interfaces';

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
    const batch = batchId ? batchId : dayjs(new Date()).format('YYYY-MM-DD');
    const reportId = ReportNames.UserAggregatedMetrics;
    const opsreports = await listOpsReportsByBatch(batch, reportId);
    if (!opsreports?.length) return;
    console.log(`grabbed ${opsreports.length} records`);

    const analytics = opsreports
      .map((report, i) => {
        if (i < 2) {
          console.log('DB record ==> ', report);
        }
        const data = JSON.parse(report.record);
        return data;
      })
      .map((e: IUserSummaryMappedValues) => {
        return {
          userId: e.userId,
          userAge: e.userAge,
          userDOB: e.userDOB,
          userState: e.userState,
          userZipCode: e.userZipCode,
          creditScore: e.creditScore,
          countAllAccounts: e.countAllAccounts,
          sumAllBalances: e.sumAllBalances,
          countOpenAccounts: e.countOpenAccounts,
          sumOpenBalances: e.sumOpenBalances,
          countDerogatoryAccounts: e.countDerogatoryAccounts,
          countPublicRecordAccounts: e.countPublicRecordAccounts,
          ageOfOldestTradeline: e.ageOfOldestTradeline,
          countOpenInstallmentAccounts: e.countOpenInstallmentAccounts,
          sumOpenInstallmentBalances: e.sumOpenInstallmentBalances,
          countOpenRealEstateAccounts: e.countOpenRealEstateAccounts,
          sumOpenRealEstateBalances: e.sumOpenRealEstateBalances,
          countOpenRevolvingAccounts: e.countOpenRevolvingAccounts,
          sumOpenRevolvingBalances: e.sumOpenRevolvingBalances,
          countOpenCollectionAccounts: e.countOpenCollectionAccounts,
          sumOpenCollectionBalances: e.sumOpenCollectionBalances,
          countOpenStudentLoanAccounts: e.countOpenStudentLoanAccounts,
          sumOpenStudentLoanBalances: e.sumOpenStudentLoanBalances,
          countOpenOtherAccounts: e.countOpenOtherAccounts,
          sumOpenOtherBalances: e.sumOpenOtherBalances,
          avgCreditLimit: e.avgCreditLimit,
          avgAgeRevolving: e.avgAgeRevolving,
          avgTermLengthInstallment: e.avgTermLengthInstallment,
          avgAPRInstallment: e.avgAPRInstallment,
        };
      });
    // send an email letting me know which segment is done

    const csvAllData = csvjson.toCSV(JSON.stringify(analytics), {
      headers: 'key',
    });
    const emails =
      STAGE === 'dev'
        ? ['jonathan@brave.credit']
        : ['jonathan@brave.credit', 'noah@brave.credit', 'jorge@brave.credit'];
    let params = generateEmailParams(`Report: ${ReportNames.UserAggregatedMetrics}`, emails);
    params.attachments = [
      {
        filename: `${ReportNames.UserAggregatedMetrics}-${batch}.csv`,
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
