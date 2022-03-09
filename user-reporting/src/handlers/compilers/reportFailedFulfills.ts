const csvjson = require('csvjson');
import * as nodemailer from 'nodemailer';
import dayjs from 'dayjs';
import { SES } from 'aws-sdk';
import { getAllItemsInDB } from 'libs/db/appdata';
import { generateEmailParams, mapEnrollmentFields } from 'libs/helpers';

const ses = new SES({ region: 'us-east-1' });
const STAGE = process.env.STAGE;

export const main = async () => {
  try {
    const fulfillCalledOn = new Date('2022-01-19');
    const items = await getAllItemsInDB();
    const allEnrolled = items
      .filter((item) => {
        const enrolled = item.agencies.transunion.enrolled;
        const fulfilledOn = new Date(item.agencies.transunion.fulfilledOn);
        const ranPriorTo = dayjs(fulfilledOn).isBefore(fulfillCalledOn);
        if (enrolled && ranPriorTo) {
          return true;
        } else {
          return false;
        }
      })
      .map((e) => mapEnrollmentFields(e));

    console.log('allEnrolled', allEnrolled.length);

    const csvAllData = csvjson.toCSV(JSON.stringify(allEnrolled), {
      headers: 'key',
    });
    const emails = STAGE === 'dev' ? ['jonathan@brave.credit'] : ['jonathan@brave.credit'];
    let params = generateEmailParams('Your failed fulfills report', emails);

    params.attachments = [
      {
        filename: 'prodDBReportFailedFulfills.csv',
        content: csvAllData,
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
