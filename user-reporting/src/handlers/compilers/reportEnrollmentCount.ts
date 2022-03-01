const csvjson = require('csvjson');
import * as nodemailer from 'nodemailer';
import { SES } from 'aws-sdk';
import { generateEmailParams } from 'libs/helpers';
import { NEW_REGISTRATIONS } from 'libs/data/new-registrations';
import { getItemInDB } from 'libs/db/appdata';

const ses = new SES({ region: 'us-east-1' });
const STAGE = process.env.STAGE;

export const main = async () => {
  try {
    const registrations = NEW_REGISTRATIONS;
    const items = await Promise.all(
      registrations.map(async (id) => {
        return await getItemInDB(id);
      }),
    );
    const enrolled = items.filter((item) => {
      return item?.Item?.agencies?.transunion?.enrolled;
    });
    const payload = {
      januaryEnrollments: enrolled.length,
    };

    const csvAllData = csvjson.toCSV(JSON.stringify(payload), {
      headers: 'key',
    });
    const emails = STAGE === 'dev' ? ['jonathan@brave.credit'] : ['jonathan@brave.credit', 'jorge@brave.credit'];
    let params = generateEmailParams('Your enrolled user count report', emails);

    params.attachments = [
      {
        filename: 'prodDBJanuaryEnrollments.csv',
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
