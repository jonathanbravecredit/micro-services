import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { response } from 'lib/utils/response';
import * as NeverBounce from 'neverbounce';
import * as AWS from 'aws-sdk';
import { BLACKLIST, TLDBLACKLIST } from 'lib/data/blacklist';
import { BraveUtil } from 'lib/utils/brave';
import { safeParse } from 'lib/utils/safeJson';
import { WHITELIST } from 'lib/data/whitelist';
import { NeverBounceErrorHandler } from 'lib/utils/neverbounce/neverbounce';

let client;
const neverSKLoc = process.env.NEVERBOUNCE_SECRET_LOCATION;
const secretsManager = new AWS.SecretsManager({
  region: process.env.AWS_REGION,
});

const getSecretKey = async () => {
  try {
    const data = await secretsManager.getSecretValue({ SecretId: neverSKLoc }).promise();
    if ('SecretString' in data) {
      return data.SecretString;
    } else {
      let buff = Buffer.from(data.SecretBinary.toString(), 'base64');
      return buff.toString('ascii');
    }
  } catch (err) {
    throw err;
  }
};

export const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // const { email } = safeParse(event, 'queryStringParameters');
  const { email } = safeParse(event, 'body');

  if (!email || email.length === 0) {
    return response(400, `no email provided - value:${email}`);
  }
  const domain = email.substring(email.lastIndexOf('@') + 1);

  if (WHITELIST[domain]) {
    return response(200, { status: 'success', result: 'valid' });
  }

  if (BLACKLIST[domain] || !BraveUtil.isEmailValid(email)) {
    return response(200, { status: 'success', result: 'invalid' });
  }

  if (TLDBLACKLIST[domain.substring(domain.lastIndexOf('.') + 1)]) {
    return response(200, { status: 'success', result: 'invalid' });
  }

  try {
    const secretJSON = await getSecretKey();
    const { neverbounce: secret } = JSON.parse(secretJSON);
    client = new NeverBounce({ apiKey: secret });
  } catch (err) {
    return response(500, { status: 'error', result: err.code });
  }

  try {
    const resp = await client.single.check(email);
    console.log('resp ===> ', resp);

    switch (resp.response.result) {
      case 'invalid':
        return response(200, { status: 'success', result: 'invalid' });
      case 'disposable':
        return response(200, { status: 'success', result: 'invalid' });
      case 'unknown':
        return response(200, { status: 'success', result: 'invalid' });
      case 'catchall':
        return response(200, { status: 'success', result: 'invalid' });
      default:
        return response(200, resp.response);
    }
  } catch (err) {
    let resp;
    switch (err.type) {
      case NeverBounce.errors.AuthError:
        // The API credentials used are bad, have you reset them recently?
        resp = 'AuthError';
        break;
      case NeverBounce.errors.BadReferrerError:
        // The script is being used from an unauthorized source, you may need to
        // adjust your app's settings to allow it to be used from here
        resp = 'BadReferrerError';
        break;
      case NeverBounce.errors.ThrottleError:
        // Too many requests in a short amount of time, try again shortly or adjust
        // your rate limit settings for this application in the dashboard
        resp = 'ThrottleError';
        break;
      case NeverBounce.errors.GeneralError:
        // A non recoverable API error occurred check the message for details
        resp = 'GeneralError';
        break;
      default:
        // Other non specific errors
        resp = 'UnspecifiedError';
        break;
    }
    const errHandler = new NeverBounceErrorHandler(401, JSON.stringify({ email, resp }));
    await errHandler.sendNotification();
    return errHandler.handleResponse('success', 'valid');
  }
};
