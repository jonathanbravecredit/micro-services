import 'reflect-metadata';
import { Handler, ScheduledEvent } from 'aws-lambda';
import * as queries from 'lib/queries';
import { generateReferralEmailParams } from 'lib/utils/cognito/helpers/helpers';
const csvjson = require('csvjson');
const nodemailer = require('nodemailer');
import { getUsers } from 'lib/utils/cognito/queries/queries';
import { SES } from 'aws-sdk';

const ses = new SES({ region: 'us-east-1' });

export const main: Handler = async (event: ScheduledEvent): Promise<void> => {
  try {
    const lookup = new Map();
    // mapping all id and referral codes for quick lookup
    (await queries.listReferrals()).forEach((r) => {
      if (r.referralCode && r.referralCode.length > 0 && r.referralCode !== '') {
        lookup.set(r.referralCode, r.id);
      }
    });
    // get list of eligible new referrals
    const referrals = await queries.listReferrals();

    // get all the users and email and add to user lookup map for quick look up
    let limit = 60;
    let paginationToken = '';
    const userLookup = new Map();
    (await getUsers(paginationToken, limit)).forEach((u) => userLookup.set(u.sub, u.email));

    // map the referrerId to the eligible referral and the emails to the id and referrerId
    const mapped = referrals.map((e) => {
      const referredById = lookup.get(e.referredByCode);
      const referredByEmail = userLookup.get(referredById);
      return {
        ...e,
        email: userLookup.get(e.id),
        referredById: referredById || '',
        referredByEmail: referredByEmail || '',
      };
    });

    // transform the data to csv and send via simple mail
    const csv = csvjson.toCSV(JSON.stringify(mapped), {
      headers: 'key',
    });
    let params = generateReferralEmailParams();
    params = {
      ...params,
      attachments: [{ filename: 'all-referrals.csv', content: csv }],
    };
    let transporter = nodemailer.createTransport({
      SES: ses,
    });
    const info = await transporter.sendMail(params);
    console.log('info ===> ', info); // log that the email was sent successfully.
  } catch (err) {
    console.log('err ==> ', err);
  }
};