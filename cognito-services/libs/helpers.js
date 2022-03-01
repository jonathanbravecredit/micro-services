'use strict';
const AWS = require('aws-sdk');
const sns = new AWS.SNS();
const accountId = process.env.ACCOUNT_ID;

const createMessageHTML = (link) => {
  return `<!DOCTYPE html >
  <html lang="en">

    <head>
      <style>
        body {
          /* font-family: Roboto, "Helvetica Neue", sans-serif; */
          font: small/1.5 Arial, Helvetica, sans-serif;
        font-size: 14px;
        background-color: #fff;
    }

    .message-section {
        margin-left: 0 auto;
        text-align: center;
    }

    .footer {
          text-align: center;
    }

    .logo-section {
          margin-left: 0 auto;
    }

    .logo>span {
          display: inline-block;
    }

    .blog-image {
          width: 20rem;
        display: block;
        margin: auto;
    }

    .brave-logo-brave {
          color: #00afb9;
        font-size: 3rem;
    }

    .brave-logo-credit {
          color: #0a1e25;
        font-size: 3rem;
        font-weight: 400;
        margin-left: -0.45rem;
    }

    .btn-container {
        margin: 0 auto;
        text-align: center;
    }

    .brave-btn {
        background-color: #1d88e5;
        color: #fff !important;
        font-weight: 700;
        font-size: 18px;
        line-height: 50px;
        box-sizing: border-box;
        position: relative;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        cursor: pointer;
        outline: 0;
        border: none;
        display: inline-block;
        white-space: nowrap;
        text-decoration: none;
        vertical-align: baseline;
        text-align: center;
        margin: 0;
        min-width: 64px;
        line-height: 36px;
        padding: 0 16px;
        border-radius: 4px;
        overflow: visible;
    }
</style>
</head>
<body>
  <section class="message-section">
    <h1>Please verify your email by clicking on the button below</h1>
    <br>
    <div style="margin-bottom: 1.5rem">
      <img style="width: 320px" src="https://d3e1i93f88eoxl.cloudfront.net/logo-text-and-icon-blurple.png">
    </div>
    <div class="btn-container" style="margin-bottom: 2rem;">
      ${link}
    </div>
    <div class="footer">
      <p>Your biggest fans,</p>
      <p>
        <b>The Brave Credit Team</b>
      </p>
    </div>
  </section>
</body>
</html>`;
};

const createWelcomeMessageHTML = (fullName, baseUrl) => {
  return `<!DOCTYPE html>
  <html lang="en">

  <head>
      <style>
          body {
              /* font-family: Roboto, "Helvetica Neue", sans-serif; */
              font: small/1.5 Arial, Helvetica, sans-serif;
              font-size: 18px;
              background-color: #fff;
          }

          p {
              font-size: 18px
          }

          .message-section {
              margin-left: 20px;
          }

          .logo {}

          a {
              font-size: 1.25rem;
              color: blue;
              text-decoration: none;
          }

          .logo>span {
              display: inline-block;
          }

          .blog-image {
              width: 20rem;
              display: block;
              margin: auto;
          }

          .brave-logo-brave {
              color: #00afb9;
              font-size: 3rem;
          }

          .brave-logo-credit {
              color: #0a1e25;
              font-size: 3rem;
              font-weight: 400;
              margin-left: -0.45rem;
          }

          .btn-container {
              margin: 0 auto;
              text-align: center;
          }

          .brave-btn {
              background-color: #00afb9;
              color: #fff;
              font-weight: 700;
              font-size: 18px;
              line-height: 50px;
              box-sizing: border-box;
              position: relative;
              -webkit-user-select: none;
              -moz-user-select: none;
              -ms-user-select: none;
              user-select: none;
              cursor: pointer;
              outline: 0;
              border: none;
              -webkit-tap-highlight-color: transparent;
              display: inline-block;
              white-space: nowrap;
              text-decoration: none;
              vertical-align: baseline;
              text-align: center;
              margin: 0;
              min-width: 120px;
              line-height: 64px;
              padding: 0 16px;
              border-radius: 4px;
              overflow: visible;
              box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14),
              0px 1px 5px 0px rgba(0, 0, 0, 0.12);
          }

          .brave-btn:hover {
              cursor: pointer;
          }
      </style>
  </head>

  <body>
      <section class="logo-section">
          <div>
              <img class="blog-image" src="https://brave.credit/assets/images/bc-logo-for-email.png">
          </div>
          <div>
              <img class="blog-image" src="https://brave.credit/assets/images/welcome-for-email.png">
          </div>
      </section>
      <br>
      <section class="message-section">
          <span>Hello ${fullName},</span>
          <br>
          <p>Welcome to Brave Credit! We look forward to helping you reach your credit score goals.
          </p>
          <p>We help you dispute errors on your credit report with all three credit bureaus for free with your help. To start, visit your dashboard to learn how to get, and upload, your free credit reports to your dashboard.
          </p>
          <br>
          <p>
          <div class="btn-container">
              <a href="${baseUrl}/userportal/stepone">
                  <button class="brave-btn">Visit my dashboard</button>
              </a>
          </div>
          </p>
          <br>
          <p style="margin: 4px 0px;">Your support specialist,</p>
          <p style="margin: 0px;">James</p>
          <br>
      </section>

  </body>

  </html>`;
};

const publishNewUserTopic = (message) => {
  if (!message) {
    return;
  }
  let params = {
    Subject: 'new user',
    Message: JSON.stringify(message, null, 2),
    TopicArn: `arn:aws:sns:us-east-2:${accountId}:accountsignup`,
  };
  console.log('params: ---> ', params);
  sns.publish(params, function (err, data) {
    if (err) {
      console.error('Unable to send message. Error JSON:', JSON.stringify(err, null, 2));
    } else {
      console.log('Results from sending message: ', JSON.stringify(data, null, 2));
    }
  });
};

const publishConfirmUserTopic = (message) => {
  if (!message) {
    return;
  }
  let params = {
    Subject: 'confirm user',
    Message: JSON.stringify(message, null, 2),
    TopicArn: `arn:aws:sns:us-east-2:${accountId}:accountconfirm`,
  };
  console.log('params: ---> ', params);
  sns.publish(params, function (err, data) {
    if (err) {
      console.error('Unable to send message. Error JSON:', JSON.stringify(err, null, 2));
    } else {
      console.log('Results from sending message: ', JSON.stringify(data, null, 2));
    }
  });
};

const publishSendMailChimpEmail = (payload) => {
  if (!payload) {
    return;
  }
  console.log('sns topic ==> ', process.env.SNS_PROXY_TOPIC);
  console.log('snsPayload', JSON.stringify(payload));
  const params = {
    Subject: 'SNS Proxy',
    Message: JSON.stringify(payload),
    TopicArn: process.env.SNS_PROXY_TOPIC,
    MessageAttributes: {
      service: {
        DataType: 'String',
        StringValue: payload.service,
      },
    },
  };
  sns.publish(params, function (err, data) {
    if (err) {
      console.error('Unable to send message. Error JSON:', JSON.stringify(err, null, 2));
    } else {
      console.log('Results from sending message: ', JSON.stringify(data, null, 2));
    }
  });
};

const listUsersByEmail = async ({ userPoolId, email }) => {
  const params = {
    UserPoolId: userPoolId,
    Filter: `email = "${email}"`,
  };
  console.log('list users by emails params ===> ', params);

  const cognitoIdp = new AWS.CognitoIdentityServiceProvider();
  return cognitoIdp.listUsers(params).promise();
};

const adminLinkUserAccounts = async ({ username, userPoolId, providerName, providerUserId }) => {
  console.log('admin linke ==> ', {
    username,
    userPoolId,
    providerName,
    providerUserId,
  });
  const params = {
    DestinationUser: {
      ProviderAttributeValue: username,
      ProviderName: 'Cognito',
    },
    SourceUser: {
      ProviderAttributeName: 'Cognito_Subject',
      ProviderAttributeValue: providerUserId,
      ProviderName: providerName,
    },
    UserPoolId: userPoolId,
  };

  const cognitoIdp = new AWS.CognitoIdentityServiceProvider();
  return cognitoIdp.adminLinkProviderForUser(params).promise();
};

const adminCreateUser = async ({ userPoolId, email }) => {
  const params = {
    UserPoolId: userPoolId,
    // SUPRESS prevents sending an email with the temporary password
    // to the user on account creation
    MessageAction: 'SUPPRESS',
    Username: email,
    UserAttributes: [
      {
        Name: 'email',
        Value: email,
      },
      {
        Name: 'email_verified',
        Value: 'true',
      },
    ],
  };

  const cognitoIdp = new AWS.CognitoIdentityServiceProvider();
  return cognitoIdp.adminCreateUser(params).promise();
};

const adminSetUserPassword = async ({ userPoolId, email }) => {
  const params = {
    Password: generatePassword(),
    UserPoolId: userPoolId,
    Username: email,
    Permanent: true,
  };

  const cognitoIdp = new AWS.CognitoIdentityServiceProvider();
  return cognitoIdp.adminSetUserPassword(params).promise();
};

function generatePassword() {
  return `${Math.random() // Generate random number, eg: 0.123456
    .toString(36) // Convert  to base-36 : "0.4fzyo82mvyr"
    .slice(-8)}24`; // Cut off last 8 characters : "yo82mvyr" and add a number, because the cognito password policy requires a number
}

const adminUpdateUserAttributes = async ({ userPoolId, username }) => {
  const params = {
    UserPoolId: userPoolId,
    Username: username,
    UserAttributes: [{ Name: 'email_verified', Value: 'true' }],
  };

  const cognitoIdp = new AWS.CognitoIdentityServiceProvider();
  return cognitoIdp.adminUpdateUserAttributes(params).promise();
};

module.exports = {
  createMessageHTML,
  createWelcomeMessageHTML,
  publishNewUserTopic,
  publishConfirmUserTopic,
  publishSendMailChimpEmail,
  listUsersByEmail,
  adminLinkUserAccounts,
  adminCreateUser,
  adminSetUserPassword,
  adminUpdateUserAttributes,
};
