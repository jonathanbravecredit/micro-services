const csvjson = require('csvjson');
import * as nodemailer from 'nodemailer';
import { SES } from 'aws-sdk';
import { listAllUsers } from 'libs/db/cognito';
import { generateEmailParams } from 'libs/helpers';
import { Handler } from 'aws-lambda';
import { ReferralQueries } from '@bravecredit/brave-sdk/dist/utils/dynamodb/queries/referral.queries';

const ses = new SES({ region: 'us-east-1' });

export const main: Handler<any, any> = async (event: any): Promise<any> => {
  const { list } = event;
  if (!list) return;
  try {
    //isolate out the active referrals
    const referrals = (await ReferralQueries.listReferrals()) as { id: string; campaignActive: string }[];
    const active = referrals.filter((i) => {
      return i.campaignActive === 'mar2022';
    });
    console.log('active ==> ', JSON.stringify(active.slice(0, 2)));
    console.log('active count ==> ', active.length);
    // throttling the cognito requests
    // get every email from cognito
    const allUsers = await listAllUsers('', 60);
    console.log('allusers count', allUsers.length);
    // map the email and sub to map
    const userEmailSub = new Map();
    allUsers.forEach((u) => userEmailSub.set(u.email, u.sub));
    console.log('userEmailSub sample ', Array.from(userEmailSub).slice(0, 1));
    console.log('userEmailSub count', userEmailSub.size);

    const knownSent = list as Array<string>; // only emails
    // map the id and email of known sent
    const knownSentIds = new Map();
    knownSent.map((email) => {
      const sub = userEmailSub.get(email);
      if (sub) knownSentIds.set(sub, email);
    });
    console.log('knownSentIds sample ', Array.from(knownSentIds).slice(0, 1));
    console.log('knownSentIds count', knownSentIds.size);
    // we have the ids now mapped, so compare to the list of active referrals.
    // if in list of all referrals but not in list of knownSent IDs
    const notSent = new Map();
    active.forEach((referral) => {
      const t1 = knownSentIds.has(referral.id);
      if (!t1) notSent.set(referral.id, true);
    });
    console.log(
      'notSent ==> ',
      JSON.stringify(
        Array.from(notSent)
          .map(([k, v]) => {
            return { id: k };
          })
          .slice(0, 1),
      ),
    );

    const content = csvjson.toCSV(
      JSON.stringify(
        Array.from(notSent).map(([k, v]) => {
          return { id: k };
        }),
      ),
      {
        headers: 'key',
      },
    );

    // config the emails transporter
    const emails = ['jonathan@brave.credit'];
    let params = generateEmailParams(`Not Sent Referral Emails`, emails);
    const filename = `blah.csv`;
    params.attachments = [{ filename, content }];
    // send the email
    let transporter = nodemailer.createTransport({
      SES: ses,
    });
    await transporter.sendMail(params);
  } catch (err) {
    console.log(err);
  }
};
