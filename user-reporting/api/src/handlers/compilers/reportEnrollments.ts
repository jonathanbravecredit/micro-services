const csvjson = require('csvjson');
import * as nodemailer from 'nodemailer';
import { SES } from 'aws-sdk';
import { getAllItemsInDB } from 'libs/db/users';
import { generateEmailParams, mapEnrollmentFields } from 'libs/helpers';
import { dateBetween, addHoursToDate } from 'libs/dates';

const ses = new SES({ region: 'us-east-1' });
const STAGE = process.env.STAGE;

export const main = async () => {
  try {
    const allItems = await getAllItemsInDB();
    const allEnrolled = allItems
      .filter((item) => {
        const enrolled = item.agencies.transunion.enrolled;
        if (enrolled) {
          return true;
        } else {
          return false;
        }
      })
      .map((e) => mapEnrollmentFields(e));
    const endMidnight = new Date(new Date().setUTCHours(0, 0, 0, 0));
    const startMidnight = addHoursToDate(new Date(endMidnight), -24);
    const pstEnd = addHoursToDate(endMidnight, 8);
    const pstStart = addHoursToDate(startMidnight, 8);
    const newEnrolled = allEnrolled.filter((item) => {
      const itemDate = new Date(item.createdAt);
      return dateBetween(pstStart, pstEnd, itemDate);
    });
    console.log('allEnrolled', allEnrolled.length);
    console.log('newEnrolled', newEnrolled.length);

    const csvAllData = csvjson.toCSV(JSON.stringify(allEnrolled), {
      headers: 'key',
    });
    const csvNewData = csvjson.toCSV(JSON.stringify(newEnrolled), {
      headers: 'key',
    });
    const emails = STAGE === 'dev' ? [''] : ['jonathan@brave.credit', 'jorge@brave.credit'];
    let params = generateEmailParams('Your enrolled user reports', emails);

    params.attachments = [
      {
        filename: 'prodDBReportEnrolledUsers.csv',
        content: csvAllData,
      },
      {
        filename: 'prodDBReportEnrolledNewUsers.csv',
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
