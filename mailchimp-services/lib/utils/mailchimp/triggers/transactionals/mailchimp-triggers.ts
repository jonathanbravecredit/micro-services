import { UpdateAppDataInput } from 'lib/aws/api.service';
import { MailchimpTriggerEmails } from 'lib/utils/mailchimp/constants';
import { IMailchimpPacket, ITransactionalData } from 'lib/utils/mailchimp/interfaces';

export class MailchimpTriggers {
  static currTriggers: IMailchimpPacket<ITransactionalData>[];
  constructor() {}

  // add different scenarios and a resolver
  static resolver(oldImage: UpdateAppDataInput, newImage: UpdateAppDataInput): IMailchimpPacket<ITransactionalData>[] {
    let triggers: IMailchimpPacket<ITransactionalData>[] = [];
    for (let key in triggerLibrary) {
      const { data, test } = triggerLibrary[key](oldImage, newImage);
      triggers = test ? (triggers = [...triggers, { template: key, data: data }]) : triggers;
    }
    this.currTriggers = triggers; // store for reference
    return triggers;
  }
}

/**
 * Check for abandoned onboarding flows
 * @param oldImage
 * @param newImage
 * @returns
 */
const checkOne = (
  oldImage: UpdateAppDataInput,
  newImage: UpdateAppDataInput,
): { test: boolean; data?: ITransactionalData } => {
  // return true;
  const priorAbandoned = oldImage?.user?.onboarding?.abandoned;
  const currAbandoned = newImage?.user?.onboarding?.abandoned;
  const onboardingComplete = newImage?.user?.onboarding?.lastComplete === 3;
  if (!onboardingComplete && !priorAbandoned && currAbandoned) {
    return {
      test: true,
      data: {
        api: 'transactional',
      },
    };
  }
  return { test: false };
};

const triggerLibrary: Record<
  string,
  (oldImage: UpdateAppDataInput, newImage: UpdateAppDataInput) => { test: boolean; data?: ITransactionalData }
> = {
  [MailchimpTriggerEmails.OnboardingDropOut]: checkOne,
};
