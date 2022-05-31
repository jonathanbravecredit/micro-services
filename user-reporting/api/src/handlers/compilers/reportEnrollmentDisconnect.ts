const csvjson = require('csvjson');
import * as nodemailer from 'nodemailer';
import { SES } from 'aws-sdk';
import { getAllItemsInDB as getAllUsers } from 'libs/db/users';
import { generateEmailParams } from 'libs/helpers';
import { getAllItemsInDB as getAllReferrals } from 'libs/db/referrals';

const ses = new SES({ region: 'us-east-1' });
const STAGE = process.env.STAGE;

export const main = async () => {
  try {
    // get all enrolled users
    const users = await getAllUsers();
    const enrolled = new Map();
    users
      .filter((user) => {
        return user.agencies.transunion.enrolled;
      })
      .forEach((u) => {
        const status = u.agencies.transunion.enrolled;
        enrolled.set(u.id, status);
      });

    // get all pending referrals
    const referrals = await getAllReferrals();
    const pending = new Map<string, string>();
    referrals
      .filter((ref) => {
        return ref.enrollmentStatus === 'pending';
      })
      .forEach((p) => pending.set(p.id, p.enrollmentStatus));

    // find the pending referrals who are enrolled;
    const disconnect = new Map();
    pending.forEach((v, k) => {
      const match = enrolled.get(k);
      if (match) disconnect.set(k, v);
    });

    const packet = Array.from(disconnect, ([name, value]) => ({ name, value }));
    const csvAllData = csvjson.toCSV(JSON.stringify(packet), {
      headers: 'key',
    });

    const emails = STAGE === 'dev' ? [''] : ['jonathan@brave.credit'];
    let params = generateEmailParams('Your referral disconnect report', emails);

    params.attachments = [
      {
        filename: 'prodEnrollmentDisconnect.csv',
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
