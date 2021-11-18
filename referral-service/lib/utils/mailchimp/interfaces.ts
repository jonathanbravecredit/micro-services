export interface MailPayload {
  service: string;
  command: string;
  message: MailMessage;
}

export interface MailMessage {
  email: string;
  action: string;
  globalMergeVars?: GlobalMergeVar[];
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

// {
//   "service": "mailchimp",
//   "command": "POST",
//   "message": {
//     "email": "jpizzolato36@gmail.com",
//     "action": "nt-01-code-to-confirm-email",
//     "globalMergeVars": [
//       {
//         "name": "href",
//         "content": "https://app.brave.credit/auth/signin?code=test123"
//       }
//     ]
//   }
// }
