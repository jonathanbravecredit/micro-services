import { APIGatewayProxyResult } from 'aws-lambda';
import { IEmailParams } from 'lib/interfaces/nodemailer.interfaces';
import { generateEmailParams } from 'lib/utils/helpers';
import { SES } from 'aws-sdk';
import * as nodemailer from 'nodemailer';
import { response } from 'lib/utils/response';
const ses = new SES({ region: 'us-east-1' });

export abstract class ValidationError {
  constructor(protected code: number, protected info: string) {}

  protected handleResponse(success: boolean | string, result: any): APIGatewayProxyResult {
    return response(this.code, { success, result });
  }

  protected generateEmail(subject: string, emails: string[], body: string): IEmailParams {
    return generateEmailParams(subject, emails, body);
  }

  protected async sendNotifications(params: IEmailParams): Promise<void> {
    let transporter = nodemailer.createTransport({ SES: ses });
    await transporter.sendMail(params);
  }
}
