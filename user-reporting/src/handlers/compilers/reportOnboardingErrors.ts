import * as nodemailer from 'nodemailer';
const csvjson = require('csvjson');
import { SES } from 'aws-sdk';
import { addHoursToDate, dateBetween } from 'libs/dates';
import { getAllItemsInDB } from 'libs/db/appdata';
import { mapErrorFields, generateEmailParams } from 'libs/helpers';

const ses = new SES({ region: 'us-east-1' });
const STAGE = process.env.STAGE;

export const main = async () => {
  try {
    const items = await getAllItemsInDB();

    const endMidnight = new Date(new Date().setUTCHours(0, 0, 0, 0));
    const startMidnight = addHoursToDate(new Date(endMidnight), -24);
    const pstEnd = addHoursToDate(endMidnight, 8);
    const pstStart = addHoursToDate(startMidnight, 8);
    console.log('end pst ==> ', pstEnd.toISOString());
    console.log('start pst ==> ', pstStart.toISOString());

    const allErrors = items
      .filter((item) => {
        if (
          item.agencies.transunion.getAuthenticationQuestionsStatus &&
          item.agencies.transunion.getAuthenticationQuestionsStatus.status === 'failed'
        )
          return true;
        if (
          item.agencies.transunion.verifyAuthenticationQuestionsOTPStatus &&
          item.agencies.transunion.verifyAuthenticationQuestionsOTPStatus.status === 'failed'
        )
          return true;
        if (
          item.agencies.transunion.indicativeEnrichmentStatus &&
          item.agencies.transunion.indicativeEnrichmentStatus.status === 'failed'
        )
          return true;
        return false;
      })
      .map((e) => mapErrorFields(e))
      .sort((a, b) => new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf());
    const newErrors = allErrors.filter((item) => {
      const itemDate = new Date(item.createdAt);
      return dateBetween(pstStart, pstEnd, itemDate);
    });

    console.log('allErrors', allErrors.length);
    console.log('newErrors', newErrors.length);

    const csvAllData = csvjson.toCSV(JSON.stringify(allErrors), {
      headers: 'key',
    });
    const csvNewData = csvjson.toCSV(JSON.stringify(newErrors), {
      headers: 'key',
    });
    const emails = STAGE === 'dev' ? [''] : ['jonathan@brave.credit'];
    let params = generateEmailParams('Your onboarding errors report', emails);

    params.attachments = [
      {
        filename: 'prodReportAllOnboardingErrors.csv',
        content: csvAllData,
      },
      {
        filename: 'prodReportNewOnboardingErrors.csv',
        content: csvNewData,
      },
    ];
    let transporter = nodemailer.createTransport({
      SES: ses,
    });

    const info = await transporter.sendMail(params);
    console.log('info --> ', info);
  } catch (err) {
    console.log(err);
  }
};
