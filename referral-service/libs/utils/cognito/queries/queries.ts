import { IAdminGetUserData } from 'libs/interfaces/cognito/cognito.interfaces';
import { formatData } from 'libs/utils/cognito/helpers/helpers';
import { IFormatDataResults } from 'libs/utils/cognito/helpers/helpers.interfaces';
const AWS = require('aws-sdk');
const util = require('util');

const cognito = new AWS.CognitoIdentityServiceProvider({
  apiVersion: '2016-04-18',
  region: 'us-east-2',
});
const pullUsers = util.promisify(cognito.listUsers.bind(cognito));
// const adminGetUser = util.promisify(cognito.adminGetUser.bind(cognito));
const USER_POOL_ID = process.env.POOL_ID;

export const getUsers = async (token: string, limit: number): Promise<IFormatDataResults[]> => {
  let results: IFormatDataResults[] = [];

  const getUsersRecurse = async (token: string, limit = 60) => {
    if (token === null || token === undefined) {
      // Finish operations
      return;
    }
    let params = {};
    if (token) {
      params = {
        UserPoolId: USER_POOL_ID /* required */,
        Limit: 60,
        PaginationToken: token,
      };
    } else {
      params = {
        UserPoolId: USER_POOL_ID /* required */,
        Limit: 60,
      };
    }

    try {
      let data = await pullUsers(params);
      results = [...results, ...data.Users];
      await getUsersRecurse(data.PaginationToken, 60);
    } catch (error) {
      console.log(error);
    }
  };

  await getUsersRecurse(token, limit);
  results = formatData(results);
  return results;
};

export const getUser = async (id: string): Promise<IAdminGetUserData> => {
  let params = {
    UserPoolId: USER_POOL_ID,
    Username: id,
  };
  let resp: IAdminGetUserData = await new Promise((resolve, reject) => {
    cognito.adminGetUser(params, (err: any, data: IAdminGetUserData) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
  return resp;
};
