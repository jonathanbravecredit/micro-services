const AWS = require('aws-sdk');
const { adminUpdateUserAttributes } = require('../libs/helpers');

module.exports.main = async (event, _context, callback) => {
  const { userPoolId, userName } = event;
  console.log('POST CONFIRMATION EVENT', JSON.stringify(event, null, 2));
  const email = ({ request: { userAttributes: { email } = {} } = {} } = event);
  const identities = ({ request: { userAttributes: { identities } = {} } = {} } = event);
  if (email) {
    const identities = attrs ? attrs['identities'] : null;
    const isExternalUser = /providername.*facebook/gi.test(identities) || /providername.*google/gi.test(identities);

    if (isExternalUser) {
      try {
        await adminUpdateUserAttributes({
          userPoolId,
          username: userName,
        });

        return callback(null, event);
      } catch (error) {
        console.log('POST AUTHENTICATION ERROR: ', JSON.stringify(error, null, 2));
        return callback(error, event);
      }
    }
  }

  return callback(null, event);
};
