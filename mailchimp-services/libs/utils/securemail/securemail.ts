import { SES } from 'aws-sdk';
import { ISecureMailParams } from 'libs/utils/securemail/interfaces';
import * as nodemailer from 'nodemailer';
import { SentMessageInfo } from 'nodemailer';
import { SecureMailTriggers } from 'libs/utils/securemail/triggers';

const ses = new SES({ region: 'us-east-1' });

export class SecureMail {
  static from = 'support@brave.credit';
  static subject = 'Dispute Status Update';
  static triggers = SecureMailTriggers;
  static transporter = nodemailer.createTransport({
    SES: ses,
  });
  constructor() {}

  static async sendMail(params: ISecureMailParams): Promise<SentMessageInfo> {
    console.log('params to send ==> ', params);
    return await this.transporter.sendMail(params);
  }
}
