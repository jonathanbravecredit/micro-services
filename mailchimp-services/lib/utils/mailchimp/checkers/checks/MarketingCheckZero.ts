import { UpdateAppDataInput } from 'lib/aws/api.service';
import { AppChecker } from 'lib/utils/mailchimp/checkers/AppChecker';
import { IMarketingCheckerResults } from 'lib/utils/mailchimp/interfaces';

export class MarketingCheckZero extends AppChecker {
  constructor(event: 'MODIFY' | 'INSERT', current: UpdateAppDataInput, prior: UpdateAppDataInput | null) {
    super(event, current, prior);
  }

  check(): IMarketingCheckerResults {
    if (this.event !== 'INSERT') return this.generateResults(false);
    const tags = [this.generateTag('no_enrolled', 'active'), this.generateTag('no_disputed', 'active')];
    return this.generateResults(true, tags);
  }
}
