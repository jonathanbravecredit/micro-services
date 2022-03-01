import { TemplateMailMessage } from 'lib/utils/mailchimp/interfaces';

export interface IMailChimp {
  messages: {
    sendTemplate: (arg0: { template_name: string; template_content: {}[]; message: TemplateMailMessage }) => any;
  };
}

export interface IMailchimpBatchPayload {
  method: string;
  path: string;
  opertation_id: string;
  body: string;
}

export interface IMailchimpBatchResponse {
  id: string;
  status: string;
  total_operations: number;
  finished_operations: number;
  errored_operations: number;
  submitted_at: string;
  completed_at: string;
  response_body_url: string;
}
