// const paidUsers = ['jpizzolato36@gmail.com', 'jonathan@brave.credit'];
const csvjson = require('csvjson');
import * as nodemailer from 'nodemailer';
import { CognitoIdentityServiceProvider, SES } from 'aws-sdk';
import { listUsersByEmail } from 'libs/db/cognito';
import { getAllItemsInDB } from 'libs/db/referrals';
import { flattenUser, generateEmailParams } from 'libs/helpers';
import { Handler } from 'aws-lambda';
s;
const pool = process.env.POOL || '';
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
    console.log('active count ==> ', active.length);
    // then I need to check against the emails I sent and find the ones that are active but not sent
    // I don't have the user Ids only the emails.
    const knowSentUser: CognitoIdentityServiceProvider.ListUsersResponse[] = await Promise.all(
      list.map(async (s: string) => {
        return await listUsersByEmail(pool, s);
      }),
    );
    console.log('users ==> ', JSON.stringify(knowSentUser.slice(0, 2)));
    console.log('known sent users count ==> ', knowSentUser.length);
    // map the attributes
    const knowSentUserTypes = knowSentUser
      .map((u) => {
        const valid = u.Users?.filter((u) => !u.Username?.startsWith('google')) || null;
        return valid ? valid[0] : null;
      })
      .filter(Boolean) as CognitoIdentityServiceProvider.UserType[];

    console.log('userTypes ==> ', JSON.stringify(knowSentUserTypes.slice(0, 2)));
    console.log('userTpyes count: ', knowSentUserTypes.length);
    // find the ones that were sent
    const wasSent = new Map();
    const subs = knowSentUserTypes.map((u) => {
      const sub = flattenUser(u.Attributes as { Name: string; Value: string }[] | undefined, 'sub');
      wasSent.set(sub, true);
      return sub;
    });
    console.log('subs ==> ', JSON.stringify(subs.slice(0, 2)));
    console.log('wasSent ==> ', JSON.stringify([...wasSent].slice(0, 2)));
    console.log('wasSent size ', wasSent.size);
    console.log('wasSent length ', [...wasSent].length);

    // if the id is in referral an not in subs, then they have not been sent.
    const notSent = new Map();
    active.forEach((r) => {
      const t1 = wasSent.has(r.id);
      if (!t1) notSent.set(r.id, true);
    });
    console.log(
      'notSent ==> ',
      JSON.stringify(
        Array.from(notSent)
          .map(([k, v]) => {
            return { id: k };
          })
          .slice(0, 2),
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
