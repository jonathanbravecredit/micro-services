import * as AWS from 'aws-sdk';

export class CognitoUtil {
  user: AWS.CognitoIdentityServiceProvider.AdminGetUserResponse | undefined;
  cognito: AWS.CognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider({
    apiVersion: '2016-04-18',
    region: 'us-east-2',
  });
  constructor(public pool: string) {}

  get email(): string {
    if (!this.user) return '';
    const { UserAttributes } = this.user;
    return (
      UserAttributes?.find((attr) => {
        return attr.Name === 'email';
      })?.Value || ''
    );
  }

  async getUserBySub(id: string): Promise<AWS.CognitoIdentityServiceProvider.AdminGetUserResponse> {
    const params: AWS.CognitoIdentityServiceProvider.AdminGetUserRequest = {
      UserPoolId: this.pool,
      Username: id,
    };
    this.user = await this.cognito.adminGetUser(params).promise();
    return this.user;
  }
}

export default CognitoUtil;
