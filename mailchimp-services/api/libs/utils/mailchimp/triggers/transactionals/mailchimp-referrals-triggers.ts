import { Referral } from "@bravecredit/brave-sdk";
import { MailchimpTriggerEmails } from "libs/utils/mailchimp/constants";
import {
  IMailchimpPacket,
  ITransactionalData,
} from "libs/utils/mailchimp/interfaces";

export class MailchimpReferralTriggers {
  static currTriggers: IMailchimpPacket<ITransactionalData>[];
  constructor() {}

  // add different scenarios and a resolver
  static resolver(
    oldImage: Referral | null,
    newImage: Referral
  ): IMailchimpPacket<ITransactionalData>[] {
    let triggers: IMailchimpPacket<ITransactionalData>[] = [];
    for (let key in triggerLibrary) {
      const { data, test } = triggerLibrary[key](oldImage, newImage);
      triggers = test
        ? (triggers = [...triggers, { template: key, data: data }])
        : triggers;
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
const checkOne = (
  oldImage: Referral | null,
  newImage: Referral
): { test: boolean; data?: ITransactionalData } => {
  return { test: false }; // inactive;
};

/**
 * Check for existing people who reach eligibility during an active campaign.
 * @param oldImage
 * @param newImage
 * @returns
 */
const checkTwo = (
  oldImage: Referral | null,
  newImage: Referral
): { test: boolean; data?: ITransactionalData } => {
  if (!oldImage) return { test: false };
  if (
    !oldImage.eligible &&
    newImage.eligible &&
    newImage.campaignActive !== "NO_CAMPAIGN"
  ) {
    return {
      test: true,
      data: {
        api: "transactional",
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
  oldImage: Referral | null,
  newImage: Referral
): { test: boolean; data?: ITransactionalData } => {
  // return { test: false }; // turning off temporarily
  if (!oldImage) return { test: false };
  if (
    newImage.eligible &&
    oldImage?.campaignActive === "NO_CAMPAIGN" &&
    newImage.campaignActive !== "NO_CAMPAIGN"
  ) {
    return {
      test: true,
      data: {
        api: "transactional",
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
  oldImage: Referral | null,
  newImage: Referral
): { test: boolean; data?: ITransactionalData } => {
  // return { test: false }; // turning off temporarily
  const t1 = checkTwo(oldImage, newImage);
  const t2 = checkThree(oldImage, newImage);
  if (t1.test || t2.test) {
    return {
      test: true,
      data: {
        api: "transactional",
        payload: newImage.referralCode,
      },
    };
  } else {
    return { test: false };
  }
};

const triggerLibrary: Record<
  string,
  (
    oldImage: Referral | null,
    newImage: Referral
  ) => { test: boolean; data?: ITransactionalData }
> = {
  [MailchimpTriggerEmails.ReferralCode]: checkTwoThree,
};
