import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { ICognitoFormattedData } from 'lib/interfaces/cognito.interfaces';
import * as util from 'util';
const congito = new CognitoIdentityServiceProvider();
const pullUsers: any = util.promisify(congito.listUsers.bind(congito));

export const listUsersByEmail = async (
  userPoolId: string,
  email: string,
): Promise<AWS.CognitoIdentityServiceProvider.ListUsersResponse> => {
  const params = {
    UserPoolId: userPoolId,
    Filter: `email = "${email}"`,
  };
  console.log('list users by emails params ===> ', params);
  return congito.listUsers(params).promise();
};

export const getUsersBySub = async (
  userPoolId: string,
  sub: string,
): Promise<AWS.CognitoIdentityServiceProvider.AdminGetUserResponse> => {
  const params: AWS.CognitoIdentityServiceProvider.AdminGetUserRequest = {
    UserPoolId: userPoolId,
    Username: sub,
  };
  console.log('list users by emails params ===> ', params);
  return congito.adminGetUser(params).promise();
};

export const flattenUser = (user: any[], key: string) => {
  const matches = user.filter((attr) => {
    return attr['Name'] === key;
  });
  if (matches.length) {
    return matches[0]['Value'];
  }
  return '';
};

export const getUsers = async (token: string, limit: number, userPoolId?: string): Promise<ICognitoFormattedData[]> => {
  let results: any[] = [];

  const getUsersRecurse = async (token: string | null | undefined, limit = 60) => {
    if (token === null || token === undefined) {
      // Finish operations
      return;
    }
    let params = {};
    if (token) {
      params = {
        UserPoolId: userPoolId /* required */,
        Limit: 60,
        PaginationToken: token,
      };
    } else {
      params = {
        UserPoolId: userPoolId /* required */,
        Limit: 60,
      };
    }

    try {
      let data: any = await pullUsers(params);
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

export const formatData = (data: any[]): ICognitoFormattedData[] => {
  let fileArr = data.map((user) => {
    let attrs = {
      sub: flattenUser(user.Attributes, 'sub'),
      email_verified: flattenUser(user.Attributes, 'email_verified'),
      email: flattenUser(user.Attributes, 'email'),
    };

    return {
      userName: user.Username,
      userCreateDate: user.UserCreateDate.toISOString(),
      enabled: user.Enabled,
      userStatus: user.UserStatus,
      ...attrs,
    };
  });
  return JSON.parse(JSON.stringify(fileArr));
};
