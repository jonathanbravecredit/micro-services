import { ICreditScoreTrackings } from 'lib/interfaces/credit-score-trackings.interfaces';
import { MailchimpTriggerEmails } from 'lib/utils/mailchimp/constants';

export class MailchimpScoreTriggers {
  static currTriggers: string[];
  constructor() {}

  // add different scenarios and a resolver
  static resolver(oldImage: ICreditScoreTrackings, newImage: ICreditScoreTrackings): string[] {
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
 * Check for new disputes started
 * @param oldImage
 * @param newImage
 * @returns
 */
const checkOne = (oldImage: ICreditScoreTrackings, newImage: ICreditScoreTrackings): boolean => {
  // return true;
  const oldModifiedOn = oldImage.modifiedOn;
  const newModifiedOn = newImage.modifiedOn;
  const oldModVal = new Date(oldModifiedOn).valueOf();
  const newModVal = new Date(newModifiedOn).valueOf();

  if (newModVal > oldModVal) {
    return true;
  }
  return false;
};

const triggerLibrary: Record<string, (oldImage: ICreditScoreTrackings, newImage: ICreditScoreTrackings) => boolean> = {
  [MailchimpTriggerEmails.ReportRefreshed]: checkOne,
};
