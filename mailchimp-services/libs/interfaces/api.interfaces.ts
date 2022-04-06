import { GlobalMergeVar, IMarketingTag } from 'libs/utils/mailchimp/interfaces';

export interface ProxyRequest {
  service: string;
  command: string;
  message: PostAPIBody;
}

export interface PostAPIBody {
  action: string;
  email: string;
  globalMergeVars?: GlobalMergeVar[];
  tag?: IMarketingTag[];
}

export interface ISNSBody<T> {
  service: string;
  command: string;
  message: T;
}
