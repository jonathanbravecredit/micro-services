import 'reflect-metadata';
import { SQSEvent, SQSHandler } from 'aws-lambda';
import { UpdateAppDataInput } from 'lib/aws/api.service';
import { ISNSBody } from 'lib/interfaces';
import { ICognitoFormattedData } from 'lib/interfaces/cognito.interfaces';
import { getItemsInDB as getAppDataItem } from 'lib/queries/appdata.queries';
import { getLastTwoReports } from 'lib/queries/CreditReport.queries';
import { getRandomDisputesById } from 'lib/queries/disputes.queries';
import { MailMessage } from 'lib/utils/mailchimp/interfaces';
import { Mailchimp } from 'lib/utils/mailchimp/mailchimp';
import { getSecretKey } from 'lib/utils/secrets';
// import * as NodeMailMessage from 'nodemailer/lib/mailer/mail-message';
const mailchimpMarketingSKLoc = process.env.MAILCHIMP_MRKT_SECRET_LOCATION || '';

export const main: SQSHandler = async (event: SQSEvent): Promise<void> => {
  const userEmailLookup = new Map();
  let mrktConfig: { apiKey: string; server: string };

  try {
    const secretJSON = await getSecretKey(mailchimpMarketingSKLoc);
    if (!secretJSON) throw `Cannot retrieve marketing secret key`;
    const { mailchimpMrkt: secret } = JSON.parse(secretJSON);
    mrktConfig = { apiKey: secret, server: 'us18' };
  } catch (err: any) {
    console.log('marketing secrets errors ===> ', err);
    return;
  }

  try {
    const records = event.Records.map((r: any) => {
      return JSON.parse(r.body) as ISNSBody<{ user: ICognitoFormattedData }>;
    });
    if (!records.length) throw 'no records';
    const data = await Promise.all(
      records.map(async (record) => {
        const {
          message: {
            user: { sub, email },
          },
        } = record;
        if (!sub || !email) return;
        userEmailLookup.set(sub, email);
        const { Item: item } = await getAppDataItem(sub);
        if (!item) return;
        const appData = item as unknown as UpdateAppDataInput;
        const disputesArr = await getRandomDisputesById(sub);
        const dispute = disputesArr.pop() || null;
        const [currReport, priorReport] = await getLastTwoReports(sub);

        return {
          appData,
          dispute,
          currReport,
          priorReport,
          // referral,
        };
      }),
    );

    // find insert triggers
    const inserts = data.map((data) => {
      if (!data) return null;
      // don't need appdata
      const disputeTriggers = data.dispute ? Mailchimp.marketing.dispute.resolver(null, data.dispute, 'INSERT') : [];
      const reportTriggers = data.currReport
        ? Mailchimp.marketing.creditReport.resolver(null, data.currReport, 'INSERT')
        : [];

      return {
        sub: data.appData.id,
        disputeTriggers,
        reportTriggers,
      };
    });

    // find modify triggers
    const modifies = data.map((data) => {
      if (!data) return null;
      const appDataTriggers = data.appData ? Mailchimp.marketing.app.resolver(null, data.appData, 'MODIFY') : [];
      const { currReport, priorReport } = data;
      const reportTriggers =
        currReport && priorReport ? Mailchimp.marketing.creditReport.resolver(priorReport, currReport, 'MODIFY') : [];

      return {
        sub: data.appData.id,
        appDataTriggers,
        reportTriggers,
      };
    });

    const payloads: MailMessage[] = [];
    inserts.forEach((insert) => {
      if (!insert) return;
      const disputeTriggers = insert.disputeTriggers;
      const allTriggers = [...disputeTriggers];
      const email = userEmailLookup.get(insert.sub);

      allTriggers.forEach((trigger) => {
        const { data } = trigger;
        if (data?.api !== 'marketing') return;
        const message = Mailchimp.createMailMessage(email, 'tag_user', undefined, data.tag);
        payloads.push(message);
      });
    });

    modifies.forEach((modified) => {
      if (!modified) return;
      const appDataTriggers = modified.appDataTriggers;
      const reportTriggers = modified.reportTriggers;
      const allTriggers = [...appDataTriggers, ...reportTriggers];
      const email = userEmailLookup.get(modified.sub);

      allTriggers.forEach((trigger) => {
        const { data } = trigger;
        if (data?.api !== 'marketing') return;
        const message = Mailchimp.createMailMessage(email, 'tag_user', undefined, data.tag);
        payloads.push(message);
      });
    });

    if (payloads.length) {
      for (let i = 0; i < 2; i++) {
        console.log('payload samples: ', JSON.stringify(payloads[i]));
      }
      const batch = Mailchimp.createBatchPayload(payloads);
      const resp = await Mailchimp.processBatchPayload(batch, mrktConfig);
      console.log('mailchimp resp: ', resp);
    }
  } catch (error) {
    console.log('merketing error ==> ', error);
  }
};
