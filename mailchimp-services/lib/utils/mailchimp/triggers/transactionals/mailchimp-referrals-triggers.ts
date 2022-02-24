import { IReferrals } from 'lib/interfaces/referrals.interfaces';
import { MailchimpTriggerEmails } from 'lib/utils/mailchimp/constants';
import { IMailchimpPacket, ITransactionalData } from 'lib/utils/mailchimp/interfaces';

export class MailchimpReferralTriggers {
  static currTriggers: IMailchimpPacket<ITransactionalData>[];
  constructor() {}

  // add different scenarios and a resolver
  static resolver(oldImage: IReferrals | null, newImage: IReferrals): IMailchimpPacket<ITransactionalData>[] {
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
 * Check for new referral enrolments
 * @param oldImage
 * @param newImage
 * @returns
 */
const checkOne = (oldImage: IReferrals | null, newImage: IReferrals): { test: boolean; data?: ITransactionalData } => {
  return { test: false }; // inactive;
};

/**
 * Check for existing people who reach eligibility during an active campaign.
 * @param oldImage
 * @param newImage
 * @returns
 */
const checkTwo = (oldImage: IReferrals | null, newImage: IReferrals): { test: boolean; data?: ITransactionalData } => {
  if (!oldImage) return { test: false };
  if (!oldImage.eligible && newImage.eligible && newImage.campaignActive !== 'NO_CAMPAIGN') {
    return {
      test: true,
      data: {
        api: 'transactional',
        payload: newImage.referralCode,
      },
    };
  } else {
    return { test: false };
  }
};

/**
 * Check for existing eligible people when the campaign flips
 * @param oldImage
 * @param newImage
 * @returns
 */
const checkThree = (
  oldImage: IReferrals | null,
  newImage: IReferrals,
): { test: boolean; data?: ITransactionalData } => {
  if (!oldImage) return { test: false };
  if (newImage.eligible && oldImage.campaignActive === 'NO_CAMPAIGN' && newImage.campaignActive !== 'NO_CAMPAIGN') {
    return {
      test: true,
      data: {
        api: 'transactional',
        payload: newImage.referralCode,
      },
    };
  } else {
    return { test: false };
  }
};

/**
 * Combination check of checkTwo and checkThree
 * @param oldImage
 * @param newImage
 * @returns
 */
const checkTwoThree = (
  oldImage: IReferrals | null,
  newImage: IReferrals,
): { test: boolean; data?: ITransactionalData } => {
  const t1 = checkTwo(oldImage, newImage);
  const t2 = checkThree(oldImage, newImage);
  if (t1.test || t2.test) {
    return {
      test: true,
      data: {
        api: 'transactional',
        payload: newImage.referralCode,
      },
    };
  } else {
    return { test: false };
  }
};

const triggerLibrary: Record<
  string,
  (oldImage: IReferrals | null, newImage: IReferrals) => { test: boolean; data?: ITransactionalData }
> = {
  [MailchimpTriggerEmails.ReferralCode]: checkTwoThree,
};
