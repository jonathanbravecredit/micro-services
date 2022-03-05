import { APIGatewayProxyResult } from 'aws-lambda';
import { ValidationError } from 'lib/utils/base/validation-error';

export class NeverBounceErrorHandler extends ValidationError {
  constructor(protected code: number, protected info: string) {
    super(code, info);
  }

  async sendNotification(): Promise<void> {
    let params = this.generateEmail(
      `!!!! [${process.env.OUR_ENV}] NEVERBOUNCE FAILED !!!!`,
      ['jonathan@brave.credit', 'jorge@brave.credit'],
      `neverbounce failed with the following info: ${this.info}`,
    );
    super.sendNotifications(params);
  }

  handleResponse(success: boolean | string, result: any): APIGatewayProxyResult {
    return super.handleResponse(success, result);
  }
}
