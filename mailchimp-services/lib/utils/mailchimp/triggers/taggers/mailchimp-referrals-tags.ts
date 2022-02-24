import { IReferrals } from 'lib/interfaces/referrals.interfaces';
import { MailchimpTriggerEmails } from 'lib/utils/mailchimp/constants';
import { IMailchimpPacket, IMarketingData } from 'lib/utils/mailchimp/interfaces';

export class MailchimpReferralTags {
  static currTriggers: IMailchimpPacket<IMarketingData>[];
  constructor() {}

  // add different scenarios and a resolver
  static resolver(oldImage: IReferrals | null, newImage: IReferrals): IMailchimpPacket<IMarketingData>[] {
    let triggers: IMailchimpPacket<IMarketingData>[] = [];
    for (let key in triggerLibrary) {
      if (triggerLibrary[key](oldImage, newImage).test) {
        const { data } = triggerLibrary[key](oldImage, newImage);
        const packet = { template: key, data: data } as IMailchimpPacket<IMarketingData>;
        triggers = [...triggers, packet];
      }
    }
    this.currTriggers = triggers; // store for reference
    return triggers;
  }
}

/**
 * Check for new referral enrolments
 * @param oldImage
 * @param newImage
 * @returns
 */
const checkOne = (oldImage: IReferrals | null, newImage: IReferrals): { test: boolean; data?: IMarketingData } => {
  return { test: false }; // inactive;
  // if (oldImage?.enrollmentStatus === 'pending' && newImage.enrollmentStatus === 'enrolled') {
  //   return {
  //     test: true,
  //     data: {
  //       api: 'transactional',
  //       payload: newImage.referralCode,
  //     },
  //   };
  // }
  return { test: false };
};

const triggerLibrary: Record<
  string,
  (oldImage: IReferrals | null, newImage: IReferrals) => { test: boolean; data?: IMarketingData }
> = {
  [MailchimpTriggerEmails.ReferralCode]: checkOne,
};
