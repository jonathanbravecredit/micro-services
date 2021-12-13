'use strict';
import { SES } from 'aws-sdk';
import { Handler } from 'aws-lambda';
import { UpdateAppDataInput } from 'lib/aws/api.service';
import { getAllItemsInDB } from 'lib/queries/appdata/appdata';
import { UserSummary } from 'lib/utils/transunion/UserSummary';
import { generateReferralEmailParams } from 'lib/utils/cognito/helpers/helpers';
const csvjson = require('csvjson');
const nodemailer = require('nodemailer');
const ses = new SES({ region: 'us-east-1' });

export const main: Handler = async (): Promise<void> => {
  try {
    const records = await getAllItemsInDB();
    let enrolled: UpdateAppDataInput[] = [];
    records.forEach((attr) => {
      const item = attr as unknown as UpdateAppDataInput;
      if (item.agencies?.transunion?.enrolled) {
        enrolled.push(item);
      }
    });
    const mapped = enrolled.map((item) => {
      const tu = item.agencies?.transunion;
      if (!tu) return null;
      const disputed = (item.agencies?.transunion?.disputeStatus?.length || 0) > 0;
      const record = new UserSummary(item.id, item.user?.userAttributes, tu, disputed);
      return {
        userId: record.id,
        zipCode: record.user?.address?.zip,
        creditScore: record.creditScore,
        countOpenAccounts: record.countOpenAccounts,
        sumBalances: record.sumBalances,
        countDerogatoryAccounts: record.countDerogatoryAccounts,
        countPublicRecordAccounts: record.countPublicRecordAccounts,
        ageOfOldestTradeline: record.ageOfOldestTradeline,
        countOpenInstallmentAccounts: record.countOpenInstallmentAccounts,
        sumOpenInstallmentBalances: record.sumOpenInstallmentBalances,
        countOpenStudentLoans: record.countOpenStudentLoanAccounts,
        sumOpenStudentLoans: record.sumStudentLoanBalance,
        countOpenRealEstateAccounts: record.countOpenRealEstateAccounts,
        sumOpenRealEstateBalances: record.sumOpenRealEstateBalance,
        countOpenRevolvingAccounts: record.countOpenRevolvingAccounts,
        sumOpenRevolvingBalances: record.sumOpenRevolvingBalances,
        countOpenCollectionAccounts: record.countOpenCollectionAccounts,
        sumOpenCollectionBalances: record.sumOpenCollectionBalances,
        countOpenOtherAccounts: record.countOpenOtherAccounts,
        sumOpenOtherBalances: record.sumOpenOtherBalances,
      };
    });

    // transform the data to csv and send via simple mail
    const csv = csvjson.toCSV(JSON.stringify(mapped), {
      headers: 'key',
    });
    let params = generateReferralEmailParams('Your user summary report');
    params = {
      ...params,
      attachments: [{ filename: `user-summary-${new Date().toISOString()}.csv`, content: csv }],
    };
    let transporter = nodemailer.createTransport({
      SES: ses,
    });
    const info = await transporter.sendMail(params);
    console.log('info ===> ', info); // log that the email was sent successfully.

    // filter for all enrolled
    // const enrolled = users.filter((u: UpdateAppDataInput)  => u.agencies?.transunion?.enrolled)
  } catch (err) {
    console.log('dynamodb error ==> ', err);
  }
};
