import { GlobalMergeVar } from 'libs/utils/mailchimp/interfaces';

export class MailchimpBase {
  static defaultGlobalMerge: GlobalMergeVar[] = [{ name: 'default', content: 'default' }];
  constructor() {}
}
