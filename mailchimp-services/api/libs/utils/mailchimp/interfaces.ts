import { CreditReport, TransunionInput, UpdateAppDataInput } from '@bravecredit/brave-sdk';

export interface MailPayload {
  service: string;
  command: string;
  message: MailMessage;
}

export interface MailMessage {
  email: string;
  action: string;
  globalMergeVars?: GlobalMergeVar[] | null;
  tag?: IMarketingTag[];
}

export interface MailMessageTo {
  email: string;
  type: string;
}
export interface MergeVar {
  name: string;
  content: string;
}
export interface GlobalMergeVar extends MergeVar {}
export interface RecipientMergeVars {
  rcpt: string;
  vars: MergeVar[];
}

export interface TemplateMailMessage {
  from_email: string;
  to: MailMessageTo[];
  global_merge_vars: GlobalMergeVar[];
}

export interface IMailchimpPacket<T> {
  template: string;
  data?: T | undefined;
}
export interface IMailchimpData {
  api: 'transactional' | 'marketing' | 'mailchimp';
  payload?: any;
}
export interface ITransactionalData extends IMailchimpData {
  api: 'transactional' | 'mailchimp';
}
export interface IMarketingData extends IMailchimpData {
  api: 'marketing';
  tag?: IMarketingTag[];
}

export interface IMarketingTag {
  name: string;
  status: 'active' | 'inactive';
}

export interface IAppChecker extends IMarketingChecker {
  currTransunion: TransunionInput | null | undefined;
  currFulfilledOn: string | null | undefined;
  priorTransunion: TransunionInput | null | undefined;
  priorFulfilledOn: string | null | undefined;
  assignTransunion: (arg0: UpdateAppDataInput | null, arg1: 'PRIOR' | 'CURRENT') => void;
  assignFulfilledOn: (arg0: TransunionInput | null | undefined, arg1: 'PRIOR' | 'CURRENT') => void;
}

export interface ICreditReportChecker extends IMarketingChecker {
  currCreditReport: CreditReport | null | undefined;
  priorCreditReport: CreditReport | null | undefined;
}

export interface IMarketingChecker {
  event: 'MODIFY' | 'INSERT';
  id: string | undefined;
  generateTag: (arg0: string, arg1: 'active' | 'inactive') => IMarketingTag;
  generateResults: (arg0: boolean, arg1: IMarketingTag[]) => IMarketingCheckerResults;
  check: () => IMarketingCheckerResults;
}

export interface IMarketingCheckerResults {
  valid: boolean;
  data: IMarketingData;
}
