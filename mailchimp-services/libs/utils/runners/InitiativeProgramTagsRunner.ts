import { DynamoDBRecord } from 'aws-lambda';
import { SNS } from 'aws-sdk';
import { UserInitiative } from 'libs/models/UserInitiative.model';
import { InitiativeCheck } from 'libs/utils/mailchimp/checkers/checks/initiatives/InitiativeCheck';
import { MailchimpTriggerEmails } from 'libs/utils/mailchimp/constants';
import { IMailchimpPacket, IMarketingCheckerResults, IMarketingData } from 'libs/utils/mailchimp/interfaces';
import { DBStreamRunner } from 'libs/utils/runners/base/dbStreamRunner';

export class InitiativeProgramTagsRunner extends DBStreamRunner<UserInitiative> {
  checker!: InitiativeCheck;
  triggers: IMailchimpPacket<IMarketingData>[] = [];
  triggerLibrary: Record<string, () => IMarketingCheckerResults> = {
    [MailchimpTriggerEmails.GoalChosen]: () => this.checker.checkOne(),
    [MailchimpTriggerEmails.GoalTaskStatus]: () => this.checker.checkTwo(),
    [MailchimpTriggerEmails.GoalProgress]: () => this.checker.checkThree(),
  };

  constructor(public event: 'MODIFY' | 'INSERT', public record: DynamoDBRecord, public sns: SNS) {
    super(record);
    this.init();
  }

  init(): void {
    super.init();
    this.checker = new InitiativeCheck(this.event, this.currImage, this.priorImage);
    this.triggers = this.resolver();
  }

  // add different scenarios and a resolver
  resolver(): IMailchimpPacket<IMarketingData>[] {
    let triggers: IMailchimpPacket<IMarketingData>[] = [];
    for (let key in this.triggerLibrary) {
      if (this.triggerLibrary[key]().valid) {
        const { data } = this.triggerLibrary[key]();
        const packet = { template: key, data: data } as IMailchimpPacket<IMarketingData>;
        triggers = [...triggers, packet];
      }
    }
    return triggers;
  }

  async publish(): Promise<void> {}
}
