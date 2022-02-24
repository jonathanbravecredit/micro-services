import * as AWS from 'aws-sdk';
import { CognitoIdentityServiceProvider, AWSError } from 'aws-sdk';
import { formatData } from 'libs/helpers';
import { IAdminGetUserData } from 'libs/interfaces/cognito.interfaces';

const cognito = new AWS.CognitoIdentityServiceProvider({
  apiVersion: '2016-04-18',
  region: 'us-east-2',
});
const USER_POOL_ID = process.env.POOL || '';
const STAGE = process.env.STAGE;
// const deleteUserUtil = util.promisify(cognitoidentityserviceprovider.adminDeleteUser.bind(cognitoidentityserviceprovider));

export const deleteUser = async (id: string) => {
  const params: CognitoIdentityServiceProvider.AdminDeleteUserRequest = {
    Username: id,
    UserPoolId: USER_POOL_ID,
  };
  try {
    await cognito.adminDeleteUser(params).promise();
  } catch (err) {
    console.log('err ==> ', err);
  }
};

export const disableUser = async (id: string) => {
  const params: CognitoIdentityServiceProvider.AdminDeleteUserRequest = {
    Username: id,
    UserPoolId: USER_POOL_ID,
  };
  try {
    await cognito.adminDisableUser(params).promise();
  } catch (err) {
    console.log('err ==> ', err);
  }
};

export const getUser = async (id: string): Promise<IAdminGetUserData> => {
  let params = {
    UserPoolId: USER_POOL_ID,
    Username: id,
  };
  let resp: IAdminGetUserData = await new Promise<IAdminGetUserData>((resolve, reject) => {
    cognito.adminGetUser(params, (err: AWSError, data: any) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
  return resp;
};

export const getCognitoUsers = async (
  token: string,
  limit: number = 60,
): Promise<CognitoIdentityServiceProvider.ListUsersResponse> => {
  const params: CognitoIdentityServiceProvider.ListUsersRequest = {
    UserPoolId: USER_POOL_ID /* required */,
    Limit: 60,
    PaginationToken: token,
  };
  const resp: CognitoIdentityServiceProvider.ListUsersResponse = await cognito.listUsers(params).promise();
  return resp;
};
