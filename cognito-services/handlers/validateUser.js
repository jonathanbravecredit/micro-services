const AWS = require('aws-sdk');
const cognito = new AWS.CognitoIdentityServiceProvider();
const stage = process.env.NODE_ENV;
const urlConfig = {
  dev: `${process.env.DEVPOST_REGISTRATION_VERIFICATION_REDIRECT_URL}/auth/signin`,
  qa: `${process.env.QAPOST_REGISTRATION_VERIFICATION_REDIRECT_URL}/auth/signin`,
  staging: `${process.env.STAGINGPOST_REGISTRATION_VERIFICATION_REDIRECT_URL}/auth/signin`,
  prod: `${process.env.PRODPOST_REGISTRATION_VERIFICATION_REDIRECT_URL}/auth/signin`,
};
const apiUrl = urlConfig[stage];

module.exports.main = async (event, context, callback) => {
  /** Immediate response for WarmUP plugin */
  if (event.source === 'serverless-plugin-warmup') {
    console.log('WarmUP - Lambda is warm!');
    return 'Lambda is warm!';
  }

  const { code, username, clientId } = event.queryStringParameters;

  const params = {
    ClientId: clientId,
    ConfirmationCode: code,
    Username: username,
  };

  if (!clientId || !code || !username) {
    // just redirect now until I can add proper error handling
    return {
      statusCode: 302,
      headers: {
        Location: apiUrl,
      },
    };
  }

  try {
    await cognito.confirmSignUp(params).promise();
    return {
      statusCode: 302,
      headers: {
        Location: apiUrl,
      },
    };
  } catch (error) {
    console.log(error); // just redirect now until I can add proper error handling
    return {
      statusCode: 302,
      headers: {
        Location: apiUrl,
      },
    };
  }
};
