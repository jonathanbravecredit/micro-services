const csvjson = require('csvjson');
import * as nodemailer from 'nodemailer';
import { SES } from 'aws-sdk';
import { getItemInDB } from 'libs/db/appdata';
import { generateEmailParams, mapEnrollmentFields } from 'libs/helpers';
import { CANCEL_ENROLLMENTS } from 'libs/data/cancel-enrollments';

const ses = new SES({ region: 'us-east-1' });
const STAGE = process.env.STAGE;

export const main = async () => {
  try {
    const stillEnrolled = await Promise.all(
      CANCEL_ENROLLMENTS.map(async (id: string) => {
        const item = await getItemInDB(id);
        if (item?.Item?.agencies?.transunion?.enrolled) {
          return item.Item;
        }
      }),
    );
    const mapped = stillEnrolled.filter(Boolean).map((e) => mapEnrollmentFields(e));

    console.log('stillEnrolled', mapped.length);

    const csvAllData = csvjson.toCSV(JSON.stringify(mapped), {
      headers: 'key',
    });
    const emails = STAGE === 'dev' ? ['jonathan@brave.credit'] : ['jonathan@brave.credit'];
    let params = generateEmailParams('Your failed cancel enrollement report', emails);

    params.attachments = [
      {
        filename: 'prodDBCancelledEnrollmentFails.csv',
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
