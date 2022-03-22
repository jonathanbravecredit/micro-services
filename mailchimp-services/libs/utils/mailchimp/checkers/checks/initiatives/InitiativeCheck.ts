import { InitiativeTask } from 'libs/classes/Initiative';
import { UserInitiative } from 'libs/models/UserInitiative.model';
import { MailchimpMarketingChecker } from 'libs/utils/mailchimp/checkers/MailchimpMarketingChecker';
import { IMarketingCheckerResults } from 'libs/utils/mailchimp/interfaces';
import * as _ from 'lodash';

export class InitiativeCheck extends MailchimpMarketingChecker<UserInitiative> {
  constructor(public event: 'INSERT' | 'MODIFY', public current: UserInitiative, public prior: UserInitiative | null) {
    super(event, current, prior);
    this.setId(current.id);
  }

  checkOne(): IMarketingCheckerResults {
    if (this.event !== 'INSERT') return this.generateResults(false);
    const goal = this.current.initiativeReason || '';
    if (goal === '') return this.generateResults(false);
    const tags = [this.generateTag(`goal_${goal}`, 'active')];
    return this.generateResults(true, tags);
  }

  checkTwo(): IMarketingCheckerResults {
    if (this.event !== 'MODIFY') return this.generateResults(false);
    const tasks: InitiativeTask[] = _.flattenDeep(this.current.initiativeTasks || []);
    if (!tasks.length) return this.generateResults(false);
    const tags = tasks.map((c) => this.generateTag(`task_${c.taskId}_${c.taskStatus}`, 'active'));
    return this.generateResults(true, tags);
  }

  checkThree(): IMarketingCheckerResults {
    if (!this.current) return this.generateResults(false);
    const status = this.current.initiativeStatus || '';
    if (status == '') return this.generateResults(false);
    if (status == 'not_started') {
      const tags = [
        this.generateTag(`goal_${status}`, 'active'),
        this.generateTag(`goal_in_progress`, 'inactive'),
        this.generateTag(`goal_complete`, 'inactive'),
      ];
      return this.generateResults(true, tags);
    } else if (status === 'in_progress') {
      const tags = [
        this.generateTag(`goal_not_started`, 'inactive'),
        this.generateTag(`goal_${status}`, 'active'),
        this.generateTag(`goal_complete`, 'inactive'),
      ];
      return this.generateResults(true, tags);
    } else if (status === 'complete') {
      const tags = [
        this.generateTag(`goal_not_started`, 'inactive'),
        this.generateTag(`goal_in_progress`, 'inactive'),
        this.generateTag(`goal_${status}`, 'active'),
      ];
      return this.generateResults(true, tags);
    } else {
      return this.generateResults(false);
    }
  }
}
