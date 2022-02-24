import { Handler, SQSEvent, SQSHandler } from 'aws-lambda';
import { UpdateAppDataInput } from 'lib/aws/api.service';
import { ISNSBody } from 'lib/interfaces';
import { ICognitoFormattedData } from 'lib/interfaces/cognito.interfaces';
import { ICreditScoreTrackings } from 'lib/interfaces/credit-score-trackings.interfaces';
import { getItemsInDB as getAppDataItem } from 'lib/queries/appdata.queries';
import { getCreditScoreTracking } from 'lib/queries/credit-score-tracking.queries';
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
        const score = await getCreditScoreTracking(sub, 'transunion');
        // const referral = await getReferral(user.sub);
        return {
          appData,
          dispute,
          score,
          // referral,
        };
      }),
    );

    // find insert triggers
    const inserts = data.map((data) => {
      if (!data) return null;
      const appDataTriggers = data.appData ? Mailchimp.marketing.app.resolver(null, data.appData, 'INSERT') : [];
      const disputeTriggers = data.dispute ? Mailchimp.marketing.dispute.resolver(null, data.dispute, 'INSERT') : [];

      return {
        sub: data.appData.id,
        appDataTriggers,
        disputeTriggers,
      };
    });

    // find modify triggers
    const modifies = data.map((data) => {
      if (!data) return null;
      const date = new Date(0).toISOString();
      const oldAppImage = { agencies: { transunion: { fulfilledOn: date } } } as UpdateAppDataInput;
      const appDataTriggers = data.appData ? Mailchimp.marketing.app.resolver(oldAppImage, data.appData, 'MODIFY') : [];
      const scoreTriggers = data.score
        ? Mailchimp.marketing.creditScore.resolver(
            {} as ICreditScoreTrackings,
            data.score as ICreditScoreTrackings,
            'MODIFY',
          )
        : [];

      return {
        sub: data.appData.id,
        appDataTriggers,
        scoreTriggers,
      };
    });

    const payloads: MailMessage[] = [];
    inserts.forEach((insert) => {
      if (!insert) return;
      const appDataTriggers = insert.appDataTriggers;
      const disputeTriggers = insert.disputeTriggers;
      const allTriggers = [...appDataTriggers, ...disputeTriggers];
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
      const scoreTriggers = modified.scoreTriggers;
      const allTriggers = [...appDataTriggers, ...scoreTriggers];
      const email = userEmailLookup.get(modified.sub);

      allTriggers.forEach((trigger) => {
        const { data } = trigger;
        if (data?.api !== 'marketing') return;
        const message = Mailchimp.createMailMessage(email, 'tag_user', undefined, data.tag);
        payloads.push(message);
      });
    });

    if (payloads.length) {
      const batch = Mailchimp.createBatchPayload(payloads);
      const resp = await Mailchimp.processBatchPayload(batch, mrktConfig);
    }
  } catch (error) {
    console.log('merketing error ==> ', error);
  }
};
