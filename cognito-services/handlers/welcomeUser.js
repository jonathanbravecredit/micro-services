'use-strict';
const { publishConfirmUserTopic } = require('../libs/helpers');
const mailChimp = require('@mailchimp/mailchimp_transactional')('6RoUu5ERtLn7fGFR6q8Cjw');
const stage = process.env.NODE_ENV;
const urlConfig = {
  dev: `${process.env.DEVPOST_REGISTRATION_VERIFICATION_REDIRECT_URL}`,
  qa: `${process.env.QAPOST_REGISTRATION_VERIFICATION_REDIRECT_URL}`,
  prod: `${process.env.PRODPOST_REGISTRATION_VERIFICATION_REDIRECT_URL}`,
};
const apiUrl = urlConfig[stage];

module.exports.main = async (event, context, callback) => {
  /** Immediate response for WarmUP plugin */
  if (event.source === 'serverless-plugin-warmup') {
    console.log('WarmUP - Lambda is warm!');
    return callback(null, 'Lambda is warm!');
  }

  if (event.triggerSource === 'PostConfirmation_ConfirmSignUp') {
    console.log(event.request.userAttributes);
    const { email } = event.request.userAttributes;
    const to = email;
    const from = 'support@brave.credit';
    const subject = "You've Almost Got Your New Brave Credit Account!";

    if (!(to && from && subject)) {
      console.log(
        `Missing parameters! Make sure to add parameters \'to\' ${to}, \'from\' ${from}, \'subject\' ${subject}`,
      );
      throw new Error(
        `Missing parameters! Make sure to add parameters \'to\' ${to}, \'from\' ${from}, \'subject\' ${subject}`,
      );
    }

    try {
      const mailMessage = {
        from_email: from,
        subject: subject,
        to: [
          {
            email,
            type: 'to',
          },
        ],
      };

      const resp = await mailChimp.messages.sendTemplate({
        template_name: 't01-welcome-email',
        template_content: [{}],
        message: mailMessage,
      });
      console.log(resp);

      if (event.request.userAttributes.sub) {
        const snsMsg = {
          sub: event.request.userAttributes.sub,
          status: event.request.userAttributes['cognito:user_status'],
        };
        console.log('snsMsg', snsMsg);
        // publishConfirmUserTopic(snsMsg);
      }
    } catch (err) {
      console.log(err);
    }
  }

  callback(null, event);
};
