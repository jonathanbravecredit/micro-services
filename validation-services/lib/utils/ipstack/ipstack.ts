import { IIpStackError } from 'lib/interfaces/ipstack.interfaces';
import { generateEmailParams } from 'lib/utils/helpers';
import { response } from 'lib/utils/response';
import { SES } from 'aws-sdk';
import * as nodemailer from 'nodemailer';
import { APIGatewayProxyResult } from 'aws-lambda';

const ses = new SES({ region: 'us-east-1' });

export class IpStackErrorHandler {
  code: number;
  info: string;
  constructor(private err: IIpStackError, private ipaddress: string) {
    this.code = isNaN(+err.code) ? -1 : +err.code;
    this.info = err.info;
  }

  async sendNotifications(): Promise<void> {
    let params = generateEmailParams(
      `!!!! IPADDRESS AT QUOTA !!!!`,
      ['jonathan@brave.credit'],
      `ipaddress: ${this.ipaddress}; failed for reason: ${JSON.stringify(this.err)}`,
    );
    let transporter = nodemailer.createTransport({ SES: ses });
    await transporter.sendMail(params);
  }

  handleResponse(): APIGatewayProxyResult {
    return response(this.code, { sucess: true, result: this.info });
  }
}
