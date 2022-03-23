import { CognitoIdentityServiceProvider } from 'aws-sdk';

export class CognitoUtil {
  user: CognitoIdentityServiceProvider.AdminGetUserResponse | undefined;
  cognito: CognitoIdentityServiceProvider = new CognitoIdentityServiceProvider();
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

  async getUserBySub(id: string): Promise<CognitoIdentityServiceProvider.AdminGetUserResponse> {
    const params: AWS.CognitoIdentityServiceProvider.AdminGetUserRequest = {
      UserPoolId: this.pool,
      Username: id,
    };
    this.user = await this.cognito.adminGetUser(params).promise();
    return this.user;
  }
}

export default CognitoUtil;
