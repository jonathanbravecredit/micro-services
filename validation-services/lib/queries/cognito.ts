import { CognitoIdentityServiceProvider } from "aws-sdk";

const cognito = new CognitoIdentityServiceProvider({
  apiVersion: "2016-04-18",
  region: "us-east-2",
});

export const listUsersByEmail = async (
  userPoolId: string,
  email: string,
): Promise<CognitoIdentityServiceProvider.ListUsersResponse> => {
  const params = {
    UserPoolId: userPoolId,
    Filter: `email = "${email}"`,
  };
  return await cognito.listUsers(params).promise();
};
