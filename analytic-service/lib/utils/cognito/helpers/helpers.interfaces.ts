export interface IFormatDataResults {
  userName: string;
  userCreateDate: string;
  enabled: boolean;
  userStatus: string;
  sub: string;
  email_verified: boolean;
  email: string;
}

export interface IEmailParams {
  from: string;
  subject: string;
  html: string;
  to: string[];
  attachments?: IEmailAttachment[];
}

export interface IEmailAttachment {
  filename: string;
  content: string;
}
