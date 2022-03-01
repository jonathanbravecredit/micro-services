export interface IEmailParams {
  from: string;
  subject: string;
  html: string;
  to: string[];
  attachments?: IEmailAttachment[];
}

export interface IEmailAttachment {
  filename: string;
  content: any;
}
