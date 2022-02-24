import { TransunionInput, UpdateAppDataInput } from 'lib/aws/api.service';
import { MailchimpMarketingChecker } from 'lib/utils/mailchimp/checkers/MailchimpMarketingChecker';
import { IAppChecker } from 'lib/utils/mailchimp/interfaces';

export class AppChecker extends MailchimpMarketingChecker<UpdateAppDataInput> implements IAppChecker {
  public id: string | undefined;
  public priorTransunion: TransunionInput | null | undefined;
  public currTransunion: TransunionInput | null | undefined;
  public priorFulfilledOn: string | null | undefined;
  public currFulfilledOn: string | null | undefined;

  constructor(public event: 'MODIFY' | 'INSERT', curr: UpdateAppDataInput, prior: UpdateAppDataInput | null) {
    super(event, curr, prior);
    this.setId(curr.id);
    this.assignTransunion(curr, 'CURRENT');
    this.assignTransunion(prior, 'PRIOR');
    this.assignFulfilledOn(this.currTransunion, 'CURRENT');
    this.assignFulfilledOn(this.priorTransunion, 'PRIOR');
  }

  assignTransunion(data: UpdateAppDataInput | null, flag: 'PRIOR' | 'CURRENT') {
    if (flag === 'PRIOR') {
      this.priorTransunion = data?.agencies?.transunion;
    }
    if (flag === 'CURRENT') {
      this.currTransunion = data?.agencies?.transunion;
    }
  }

  assignFulfilledOn(data: TransunionInput | null | undefined, flag: 'PRIOR' | 'CURRENT') {
    if (flag === 'PRIOR') {
      this.priorFulfilledOn = data?.fulfilledOn;
    }
    if (flag === 'CURRENT') {
      this.currFulfilledOn = data?.fulfilledOn;
    }
  }
}
