import { UpdateAppDataInput } from 'lib/aws/api.service';
import { MailchimpTriggerEmails } from 'lib/utils/mailchimp/constants';

export class MailchimpTriggers {
  static currTriggers: string[];
  constructor() {}

  // add different scenarios and a resolver
  static resolver(oldImage: UpdateAppDataInput, newImage: UpdateAppDataInput): string[] {
    let triggers: string[] = [];
    for (let key in triggerLibrary) {
      if (triggerLibrary[key](oldImage, newImage)) {
        triggers = [...triggers, key];
      }
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
const checkOne = (oldImage: UpdateAppDataInput, newImage: UpdateAppDataInput): boolean => {
  // return true;
  const priorAbandoned = oldImage?.user?.onboarding?.abandoned;
  const currAbandoned = newImage?.user?.onboarding?.abandoned;
  const onboardingComplete = newImage?.user?.onboarding?.lastComplete === 3;
  if (!onboardingComplete && !priorAbandoned && currAbandoned) {
    return true;
  }
  return false;
};

const triggerLibrary: Record<string, (oldImage: UpdateAppDataInput, newImage: UpdateAppDataInput) => boolean> = {
  [MailchimpTriggerEmails.OnboardingDropOut]: checkOne,
};
