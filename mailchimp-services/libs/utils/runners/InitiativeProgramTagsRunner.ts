import { DynamoDBRecord } from 'aws-lambda';
import { SNS } from 'aws-sdk';
import { UserInitiative } from 'libs/models/UserInitiative.model';
import { CognitoUtil } from 'libs/utils/cognito/cognito';
import { InitiativeCheck } from 'libs/utils/mailchimp/checkers/checks/initiatives/InitiativeCheck';
import { MailchimpTriggerEmails } from 'libs/utils/mailchimp/constants';
import { IMailchimpPacket, IMarketingCheckerResults, IMarketingData } from 'libs/utils/mailchimp/interfaces';
import { Mailchimp } from 'libs/utils/mailchimp/mailchimp';
import { DBStreamRunner } from 'libs/utils/runners/base/dbStreamRunner';

export class InitiativeProgramTagsRunner extends DBStreamRunner<UserInitiative> {
  email: string = '';
  sns: SNS = new SNS();
  packets!: IMailchimpPacket<IMarketingData>[];
  triggerLibrary: Record<
    string,
    (prior: UserInitiative | null, curr: UserInitiative, event: 'INSERT' | 'MODIFY') => IMarketingCheckerResults
  > = {
    [MailchimpTriggerEmails.GoalChosen]: (p, c, e) => new InitiativeCheck(e, c, p).checkOne(),
    [MailchimpTriggerEmails.GoalTaskStatus]: (p, c, e) => new InitiativeCheck(e, c, p).checkTwo(),
    [MailchimpTriggerEmails.GoalProgress]: (p, c, e) => new InitiativeCheck(e, c, p).checkThree(),
  };

  constructor(public event: 'MODIFY' | 'INSERT', public record: DynamoDBRecord, public pool: string) {
    super(record);
    this.init();
  }

  init(): void {
    super.init();
  }

  async getEmail(): Promise<void> {
    const cognito = new CognitoUtil(this.pool);
    await cognito.getUserBySub(this.currImage.id);
    this.email = cognito.email;
  }

  // add different scenarios and a resolver
  getPackets(): void {
    this.packets = [];
    for (let key in this.triggerLibrary) {
      const { valid, data } = this.triggerLibrary[key](this.priorImage, this.currImage, this.event);
      if (valid) {
        const packet = { template: key, data: data } as IMailchimpPacket<IMarketingData>;
        this.packets = [...this.packets, packet];
      }
    }
  }

  async publish(): Promise<void> {
    if (!this.email) return;
    await Promise.all(
      this.packets.map(async (pack) => {
        const { data, template } = pack;
        if (data?.api !== 'marketing') return;
        const message = Mailchimp.createMailMessage(this.email, 'tag_user', undefined, data.tag);
        const payload = Mailchimp.createSNSPayload('marketing', message, 'marketing');
        await this.sns.publish(payload).promise();
      }),
    );
  }
}
