const AWS = require('aws-sdk');
const response = require('../libs/response');
const mailChimp = require('@mailchimp/mailchimp_transactional')('6RoUu5ERtLn7fGFR6q8Cjw');
const { listUsersByEmail, adminLinkUserAccounts, adminCreateUser, adminSetUserPassword } = require('../libs/helpers');

module.exports.main = async (event, context, callback) => {
  console.log('event ===> ', event);

  try {
    const {
      triggerSource,
      userPoolId,
      userName,
      request: {
        userAttributes: { email },
      },
    } = event;

    const EXTERNAL_AUTHENTICATION_PROVIDER = 'PreSignUp_ExternalProvider';

    if (triggerSource === EXTERNAL_AUTHENTICATION_PROVIDER) {
      // --> User has registered with Google/Facebook external providers
      const usersFilteredByEmail = await listUsersByEmail({
        userPoolId,
        email,
      });
      console.log('userName ==> ', userName);
      // userName example: "facebook_12324325436" or "google_1237823478"
      // needs to be title case...Facebook
      const [providerNameValue, providerUserId] = userName.split('_');
      const providerName = ['Google', 'Facebook'].find((val) => providerNameValue.toLowerCase() === val.toLowerCase());

      console.log('users by email ===> ', usersFilteredByEmail.Users);
      if (usersFilteredByEmail.Users && usersFilteredByEmail.Users.length > 0) {
        // user already has cognito account
        const cognitoUsername = usersFilteredByEmail.Users[0].Username || 'username-not-found';

        // if they have access to the Google / Facebook account of email X, verify their email.
        // even if their cognito native account is not verified
        const linkResp = await adminLinkUserAccounts({
          username: cognitoUsername,
          userPoolId,
          providerName,
          providerUserId,
        });
        console.log('linkResp 1 ==> ', event.response);
      } else {
        console.log('in set up account');
        /* --> if federated but a user does not have a cognito native account ->
            1. create a native cognito account
            2. change the password, to change status from FORCE_CHANGE_PASSWORD to CONFIRMED
            3. merge the social and the native accounts
            4. add the user to a group - OPTIONAL
        */
        const createdCognitoUser = await adminCreateUser({
          userPoolId,
          email,
        });
        console.log('created cognito user ===> ', createdCognitoUser);

        await adminSetUserPassword({ userPoolId, email });

        const cognitoNativeUsername = createdCognitoUser.User
          ? createdCognitoUser.User.Username || 'username-not-found'
          : 'username-not-found';

        const linkResp = await adminLinkUserAccounts({
          username: cognitoNativeUsername,
          userPoolId,
          providerName,
          providerUserId,
        });

        // // OPTIONALLY add the user to a group
        // await adminAddUserToGroup({
        //   userPoolId,
        //   username: cognitoNativeUsername,
        //   groupName: 'Users',
        // });

        // OPTIONALLY send welcome email
        const to = email;
        const from = 'support@brave.credit';
        const subject = 'Your New Brave Credit Account!';
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
        console.log('email resp ==> ', resp);

        event.response.autoConfirmUser = true;
        event.response.autoVerifyEmail = true;
        console.log('linkResp 2 ==> ', event.response);
      }
    }
    console.log('event ==> ', event);
    return callback(null, event);
  } catch (err) {
    return callback(err, event);
  }
};
