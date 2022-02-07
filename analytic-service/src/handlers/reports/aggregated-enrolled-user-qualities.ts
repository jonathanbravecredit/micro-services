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
      const userData = item.user;
      if (!tu || !userData) return null;
      const userDateOfBirth = `${userData.userAttributes?.dob?.year}-${userData.userAttributes?.dob?.month}-${userData.userAttributes?.dob?.day}`;
      const disputed = (item.agencies?.transunion?.disputeStatus?.length || 0) > 0;
      const record = new UserSummary(item.id, item.user?.userAttributes, tu, disputed);
      return {
        userId: record.id,
        userDOB: userDateOfBirth,
        userState: userData.userAttributes?.address?.state,
        zipCode: record.user?.address?.zip,
        creditScore: record.creditScore,
        countOpenAccounts: record.countOpenAccounts,
        sumBalances: record.sumBalances,
        countDerogatoryAccounts: record.countDerogatoryAccounts,
        countPublicRecordAccounts: record.countPublicRecordAccounts,
        ageOfOldestTradeline: record.ageOfOldestTradeline,
        countOpenInstallmentAccounts: record.countOpenInstallmentAccounts, //TODO make sure populated
        sumOpenInstallmentBalances: record.sumOpenInstallmentBalances, //TODO make sure populated
        countOpenStudentLoans: record.countOpenStudentLoanAccounts,
        sumOpenStudentLoans: record.sumStudentLoanBalance,
        countOpenRealEstateAccounts: record.countOpenRealEstateAccounts, //TODO make sure populated
        sumOpenRealEstateBalances: record.sumOpenRealEstateBalance, //TODO make sure populated
        countOpenRevolvingAccounts: record.countOpenRevolvingAccounts,
        sumOpenRevolvingBalances: record.sumOpenRevolvingBalances,
        countOpenCollectionAccounts: record.countOpenCollectionAccounts, //TODO make sure populated
        sumOpenCollectionBalances: record.sumOpenCollectionBalances, //TODO make sure populated
        countOpenOtherAccounts: record.countOpenOtherAccounts, //TODO make sure populated
        sumOpenOtherBalances: record.sumOpenOtherBalances, //TODO make sure populated
      };
    });

    // transform the data to csv and send via simple mail
    const csv = csvjson.toCSV(JSON.stringify(mapped), {
      headers: 'key',
    });
    let params = generateReferralEmailParams('Your aggregated enrolled user qualities report');
    params = {
      ...params,
      attachments: [{ filename: `aggregated-enrolled-user-qualities-${new Date().toISOString()}.csv`, content: csv }],
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
