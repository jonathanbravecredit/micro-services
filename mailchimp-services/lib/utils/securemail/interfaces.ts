export interface ISecureMailParams {
  from: string;
  subject: string;
  html: string;
  to: string[];
}

export interface ISecureMailData {
  api: 'securemail';
  payload: any;
  from: string;
  subject: string;
}

export interface ISecureMailPacket<T> {
  template: string;
  data: T;
}
