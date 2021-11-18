import { GlobalMergeVar } from 'lib/utils/mailchimp/interfaces';

export interface ProxyRequest {
  service: string;
  command: string;
  message: PostAPIBody;
}

export interface PostAPIBody {
  action: string;
  email: string;
  globalMergeVars?: GlobalMergeVar[];
}

// export interface SNSProxyParams implements{
//   Subject: string;
//   Message: T;
//   TopicArn: string;
// }
