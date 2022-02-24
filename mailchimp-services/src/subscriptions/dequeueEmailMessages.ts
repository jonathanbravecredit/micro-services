const MailChimpTx = require('@mailchimp/mailchimp_transactional');
import * as interfaces from 'lib/interfaces';
import { ajv } from 'lib/schema/validation';
import { SNSEvent, SNSHandler } from 'aws-lambda';
import { Mailchimp as chimp } from 'lib/utils/mailchimp/mailchimp';
import { response } from 'lib/utils/response';
import { getSecretKey } from 'lib/utils/secrets';
import { IMailChimp } from 'lib/interfaces/mailchimp.interfaces';

let mailChimp: IMailChimp;
const mailchimpSKLoc = process.env.MAILCHIMP_SECRET_LOCATION || '';
const mailchimpMarketingSKLoc = process.env.MAILCHIMP_MRKT_SECRET_LOCATION || '';
const bcEmail = process.env.EMAIL || '';

export const main: SNSHandler = async (event: SNSEvent): Promise<any> => {
  let trxRequests: interfaces.ProxyRequest[] = [];
  let mrktRequests: interfaces.ProxyRequest[] = [];
  let mrktConfig: { apiKey: string; server: string };

  try {
    for (const record of event.Records) {
      console.log('record=', record);
      const {
        Sns: { Message: message },
      } = record;

      const payload: interfaces.ProxyRequest = JSON.parse(message);
      const validate = ajv.getSchema<interfaces.ProxyRequest>('mailChimpRequest');
      if (!validate) throw `Schema validator missing=${validate}`;
      if (!validate(payload)) throw `Malformed message=${message}`;
      // parse the emails into transactional or marketing
      if (payload.service.toLowerCase() === 'mailchimp') {
        trxRequests = [...trxRequests, payload];
      }
      if (payload.service.toLowerCase() === 'marketing') {
        mrktRequests = [...mrktRequests, payload];
      }
    }
  } catch (err) {
    console.log('records error ===> ', err);
  }

  // transactional secrets
  try {
    const secretJSON = await getSecretKey(mailchimpSKLoc);
    if (!secretJSON) throw `Cannot retrieve secret key`;
    const { mailchimpTx: secret } = JSON.parse(secretJSON);
    mailChimp = MailChimpTx(secret);
  } catch (err: any) {
    console.log('transactions secrets errors ===> ', err);
    return response(500, `error retrieving key: ${err.code}`);
  }

  // marketing secrets
  try {
    const secretJSON = await getSecretKey(mailchimpMarketingSKLoc);
    if (!secretJSON) throw `Cannot retrieve marketing secret key`;
    const { mailchimpMrkt: secret } = JSON.parse(secretJSON);
    mrktConfig = { apiKey: secret, server: 'us18' };
  } catch (err: any) {
    console.log('marketing secrets errors ===> ', err);
    return response(500, `error retrieving key: ${err.code}`);
  }

  try {
    if (trxRequests.length) {
      await Promise.all(
        trxRequests.map(async (req) => {
          await chimp.processTransactionalMessages(req, mailChimp, bcEmail);
        }),
      );
    }
  } catch (err) {
    console.log('transaction errors ===> ', err);
    return response(400, 'failed to process transactional request');
  }

  try {
    if (mrktRequests.length) {
      console.log('marketRequest ==> ', JSON.stringify(mrktRequests));
      console.log('market config ==> ', mrktConfig);
      await Promise.all(
        mrktRequests.map(async (req) => {
          await chimp.processMarketingMessages(req, mrktConfig);
        }),
      );
    }
  } catch (err) {
    console.log('marketing errors ===> ', err);
    return response(400, 'failed to process marketing request');
  }

  return response(200, 'success');
};
