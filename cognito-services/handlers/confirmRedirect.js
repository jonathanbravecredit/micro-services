const response = require('../libs/response');
const { createMessageHTML, publishSendMailChimpEmail } = require('../libs/helpers');
const mailChimp = require('@mailchimp/mailchimp_transactional')('6RoUu5ERtLn7fGFR6q8Cjw');
const { SNS } = require('aws-sdk');
const sns = new SNS({ apiVersion: '2012-11-05' });

// Creating a custom URL for the user
const region = process.env.REGION;
const stage = process.env.NODE_ENV;
const urlConfig = {
  dev: process.env.DEVAPIURL,
  qa: process.env.QAAPIURL,
  staging: process.env.STAGINGAPIURL,
  prod: process.env.PRODAPIURL,
};
const apiUrl = urlConfig[stage];

module.exports.main = (event, context, callback) => {
  /** Immediate response for WarmUP plugin */
  if (event.source === 'serverless-plugin-warmup') {
    console.log('WarmUP - Lambda is warm!');
    return callback(null, 'Lambda is warm!');
  }

  if (event.triggerSource === 'CustomMessage_SignUp' || event.triggerSource === 'CustomMessage_ResendCode') {
    const { codeParameter } = event.request;
    const { userName, region } = event;
    const { clientId } = event.callerContext;
    const { email } = event.request.userAttributes;
    // const message = { userName, region, clientId, email };

    if (event.triggerSource === 'CustomMessage_SignUp') {
      // publishNewUserTopic(message); // creates the user...handled front end now
    }

    if (!email) {
      console.log(`Missing parameters! Make sure to add parameters \'to\' ${email}`);
      throw new Error(`Missing parameters! Make sure to add parameters \'to\' ${email}`);
    }

    const url = `${apiUrl}.${region}.amazonaws.com/${stage}/redirect`;
    const href = `${url}?code=${codeParameter}&username=${userName}&clientId=${clientId}&region=${region}&email=${email}`;
    console.log('href ==> ', href);
    const link = `<a href="${url}?code=${codeParameter}&username=${userName}&clientId=${clientId}&region=${region}&email=${email}" target="_blank"><button class="brave-btn">Confirm my email</button></a>`;
    // publishSendMailChimpEmail(email, href); // STILL NEEDS WORK...need to enable CustomSender Trigger (not available in console);
    event.response.emailSubject = 'Brave Credit | Please confirm your email';
    event.response.emailMessage = createMessageHTML(link);

    const payload = {
      service: 'marketing',
      command: 'POST',
      message: {
        email: email,
        action: 'add_new_user',
      },
    };
    publishSendMailChimpEmail(payload);
  }
  // CallBack to the lambda for the email trigger
  callback(null, event);
};
