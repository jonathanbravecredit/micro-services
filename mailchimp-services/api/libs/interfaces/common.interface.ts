export interface IDate {
  month: string | number | null;
  year: string | number | null;
  day: string | number | null;
}

export interface IPartitionSet {
  partitionSet: number | string | null;
}
export interface IPartitionElements extends IPartitionSet {
  dateReported: string | null;
  dateUpdated: string | null;
}

export interface ITUServiceResponse<T> {
  success: boolean;
  error?: IErrorResponse;
  data?: T;
}

export interface ITUUnparsed {
  unparsed: string;
}

export interface ITUText {
  type?: number | string;
  text?: string;
}

export interface IErrorResult {
  AccountName: string;
  ErrorResponse: IErrorResponse;
  RequestKey: string;
  ClientKey: string;
  EnrollmentKey?: string;
  ServiceBundleFulfillmentKey?: string;
}

export interface IErrorResponse {
  Code: number | string;
  Name?: string;
  Message?: string;
}

export interface IErrorCodes {
  [key: string]: IErrorCode;
}

export interface IErrorCode {
  code: string;
  name: string;
  message: string;
  category: string;
  method: string;
  action: string;
}

export interface INil {
  nil: true;
}
