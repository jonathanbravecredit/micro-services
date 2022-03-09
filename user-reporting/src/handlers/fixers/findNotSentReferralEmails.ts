// const paidUsers = ['jpizzolato36@gmail.com', 'jonathan@brave.credit'];
const csvjson = require('csvjson');
import * as nodemailer from 'nodemailer';
import { CognitoIdentityServiceProvider, SES } from 'aws-sdk';
import { listUsersByEmail } from 'libs/db/cognito';
import { getAllItemsInDB } from 'libs/db/referrals';
import { flattenUser, generateEmailParams } from 'libs/helpers';
import { Handler } from 'aws-lambda';
const knowSent: string[] = ['jpizzolato36@gmail.com', 'jonathan@brave.credit'];
const pool = '';
const ses = new SES({ region: 'us-east-1' });

export const main: Handler<any, any> = async (event: any): Promise<any> => {
  const { list } = event;
  if (!list) return;
  try {
    //isolate out the active referrals
    const referrals = (await getAllItemsInDB()) as { id: string; campaignActive: string }[];
    const active = referrals.filter((i) => {
      return i.campaignActive === 'mar2022';
    });
    console.log('active ==> ', JSON.stringify(active.slice(0, 2)));
    // then I need to check against the emails I sent and find the ones that are active but not sent
    // I don't have the user Ids only the emails.
    const users: CognitoIdentityServiceProvider.ListUsersResponse[] = await Promise.all(
      knowSent.map(async (s) => {
        return await listUsersByEmail(pool, s);
      }),
    );
    console.log('users ==> ', JSON.stringify(users.slice(0, 2)));
    // map the attributes
    const userTypes = users
      .map((u) => {
        return u.Users ? u.Users[0] : null;
      })
      .filter(Boolean) as CognitoIdentityServiceProvider.UserType[];

    console.log('userTypes ==> ', JSON.stringify(userTypes.slice(0, 2)));
    // find the ones that were sent
    const wasSent = new Set();
    const subs = userTypes.map((u) => {
      const sub = flattenUser(u.Attributes as { Name: string; Value: string }[] | undefined, 'sub');
      wasSent.add(sub);
      return sub;
    });
    console.log('subs ==> ', JSON.stringify(subs.slice(0, 2)));
    console.log('wasSent ==> ', JSON.stringify([...wasSent].slice(0, 2)));
    // if the id is in referral an not in subs, then they have not been sent.
    const notSent = new Set();
    active.forEach((r) => {
      const t1 = wasSent.has(r.id);
      if (!t1) notSent.add(r.id);
    });
    console.log('notSent ==> ', JSON.stringify([...notSent].slice(0, 2)));

    const content = csvjson.toCSV(JSON.stringify({ notSent: [...notSent] }), {
      headers: 'key',
    });

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
