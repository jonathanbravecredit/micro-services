import { TransunionInput, UpdateAppDataInput } from 'libs/aws/api.service';
import {
  IAppChecker,
  IMarketingChecker,
  IMarketingCheckerResults,
  IMarketingTag,
} from 'libs/utils/mailchimp/interfaces';

export class MailchimpMarketingChecker<T> implements IMarketingChecker {
  id: string | undefined;

  constructor(public event: 'MODIFY' | 'INSERT', curr: T, prior: T | null) {}

  setId(id: string): void {
    this.id = id;
  }

  generateTag(name: string, status: 'active' | 'inactive') {
    return {
      name,
      status,
    };
  }

  generateResults(valid: boolean, tag?: IMarketingTag[]): IMarketingCheckerResults {
    return {
      valid,
      data: {
        api: 'marketing',
        tag,
      },
    };
  }

  check(): IMarketingCheckerResults {
    return this.generateResults(false);
  }
}
