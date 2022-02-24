import { UpdateAppDataInput } from 'lib/aws/api.service';
import { AppChecker } from 'lib/utils/mailchimp/checkers/AppChecker';
import { IMarketingCheckerResults } from 'lib/utils/mailchimp/interfaces';

export class MarketingCheckOne extends AppChecker {
  constructor(event: 'MODIFY' | 'INSERT', current: UpdateAppDataInput, prior: UpdateAppDataInput | null) {
    super(event, current, prior);
  }

  check(): IMarketingCheckerResults {
    if (this.event !== 'MODIFY') return this.generateResults(false);
    if (this.currTransunion?.enrolled) {
      const tags = [this.generateTag('enrolled', 'active'), this.generateTag('no_enrolled', 'inactive')];
      return this.generateResults(true, tags);
    } else {
      const tags = [this.generateTag('enrolled', 'inactive'), this.generateTag('no_enrolled', 'active')];
      return this.generateResults(true, tags);
    }
  }
}
