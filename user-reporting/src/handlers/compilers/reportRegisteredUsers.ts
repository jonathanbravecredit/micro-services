const csvjson = require('csvjson');
import { SES } from 'aws-sdk';
import { getUsers, generateEmailParams, mapRegistrationFields } from 'libs/helpers';
import * as nodemailer from 'nodemailer';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault('America/Los_Angeles');

const ses = new SES({ region: 'us-east-1' });
const STAGE = process.env.STAGE;

var limit = 60;
var paginationToken = '';

export const main = async () => {
  // Call function to pull data and write it to file
  try {
    const laYear = dayjs.tz(new Date(), 'America/Los_Angeles').year();
    const cutoff = `${laYear}-01-01`;

    let allUsers = await getUsers(paginationToken, limit); // from cognito
    let allUsersSorted = allUsers
      .sort((a, b) => new Date(b.userCreateDate).valueOf() - new Date(a.userCreateDate).valueOf())
      .filter((i) => dayjs(i.userCreateDate).isAfter(dayjs.tz(cutoff)))
      .map((i) => mapRegistrationFields(i));
    console.log('all data', allUsers.length);
    const csvAllData = csvjson.toCSV(JSON.stringify(allUsersSorted), {
      headers: 'key',
    });

    const emails = STAGE === 'dev' ? [''] : ['jonathan@brave.credit', 'jorge@brave.credit'];
    let params = generateEmailParams('Your registered user reports', emails);

    params.attachments = [
      {
        filename: 'prodPoolReportAllUsers.csv',
        content: csvAllData,
      },
    ];
    let transporter = nodemailer.createTransport({
      SES: ses,
    });

    const info = await transporter.sendMail(params);
    console.log('info --> ', info);
  } catch (error) {
    console.log(error);
  }
};
