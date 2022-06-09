const csvjson = require('csvjson');
import * as nodemailer from 'nodemailer';
import { SES } from 'aws-sdk';
import { countAllFailedInDB } from 'libs/db/users';
import { generateEmailParams } from 'libs/helpers';

const ses = new SES({ region: 'us-east-1' });
const STAGE = process.env.STAGE;

export const main = async () => {
  try {
    const count = await countAllFailedInDB();
    const payload = {
      januaryFailures: count,
    };

    const csvAllData = csvjson.toCSV(JSON.stringify(payload), {
      headers: 'key',
    });
    const emails = STAGE === 'dev' ? ['jonathan@brave.credit'] : ['jonathan@brave.credit', 'jorge@brave.credit'];
    let params = generateEmailParams('Your failed user count report', emails);

    params.attachments = [
      {
        filename: 'prodDBJanuaryFailed.csv',
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
