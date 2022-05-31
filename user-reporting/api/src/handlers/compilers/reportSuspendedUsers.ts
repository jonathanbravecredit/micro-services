import { SES } from 'aws-sdk';
const csvjson = require('csvjson');
import * as nodemailer from 'nodemailer';
import { IEmailParams } from 'libs/interfaces/helper.interfaces';
import { addHoursToDate, dateBetween } from 'libs/dates';
import { getAllSuspendedUsersInDB } from 'libs/db/users';
import { generateEmailParams } from 'libs/helpers';

const ses = new SES({ region: 'us-east-1' });
const STAGE = process.env.STAGE;

export const main = async () => {
  try {
    const allFailed = await getAllSuspendedUsersInDB();

    const endMidnight = new Date(new Date().setUTCHours(0, 0, 0, 0));
    const startMidnight = addHoursToDate(new Date(endMidnight), -24);
    const pstEnd = addHoursToDate(endMidnight, 7);
    const pstStart = addHoursToDate(startMidnight, 7);
    console.log('end pst ==> ', pstEnd.toISOString());
    console.log('start pst ==> ', pstStart.toISOString());

    const newFailed = allFailed.filter((item) => {
      const itemDate = new Date(item.createdAt);
      return dateBetween(pstStart, pstEnd, itemDate);
    });
    console.log('allFailed', allFailed.length);
    console.log('newFailed', newFailed.length);

    const csvAllData = csvjson.toCSV(JSON.stringify(allFailed), {
      headers: 'key',
    });
    const csvNewData = csvjson.toCSV(JSON.stringify(newFailed), {
      headers: 'key',
    });

    const emails = STAGE === 'dev' ? [''] : ['jonathan@brave.credit', 'jorge@brave.credit'];
    let params: IEmailParams = generateEmailParams('Your suspended users report', emails);

    params.attachments = [
      {
        filename: 'prodReportAllSuspendedUsers.csv',
        content: csvAllData,
      },
      {
        filename: 'prodReportNewSuspended.csv',
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
