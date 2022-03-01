import 'reflect-metadata';
const csvjson = require('csvjson');
import * as nodemailer from 'nodemailer';
import { SES } from 'aws-sdk';
import { getAllDisputesInDB } from 'libs/db/disputes';
import { generateEmailParams } from 'libs/helpers';

const ses = new SES({ region: 'us-east-1' });
const STAGE = process.env.STAGE;

export const main = async () => {
  try {
    const disputes = await getAllDisputesInDB();
    const csvDisputes = csvjson.toCSV(JSON.stringify(disputes), {
      headers: 'key',
    });
    const emails = STAGE === 'dev' ? ['jonathan@brave.credit'] : ['jonathan@brave.credit'];
    let params = generateEmailParams('Your disputes report', emails);

    params.attachments = [
      {
        filename: 'prodDBDisputesReport.csv',
        content: csvDisputes,
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
