import { SES } from 'aws-sdk';
import { ISecureMailParams } from 'lib/utils/securemail/interfaces';
import * as nodemailer from 'nodemailer';
import { SentMessageInfo } from 'nodemailer';
import { SecureMailGenerators } from 'lib/utils/securemail/generators';
import { SecureMailTriggers } from 'lib/utils/securemail/triggers';

const ses = new SES({ region: 'us-east-1' });

export class SecureMail {
  static from = 'support@brave.credit';
  static subject = 'Dispute Status Update';
  static generators = SecureMailGenerators;
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
