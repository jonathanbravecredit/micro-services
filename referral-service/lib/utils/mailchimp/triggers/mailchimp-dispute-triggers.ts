import { UpdateAppDataInput } from 'lib/aws/api.service';
import { IDispute } from 'lib/interfaces';
import { MailchimpTriggerEmails } from 'lib/utils/mailchimp/constants';

export class MailchimpDisputeTriggers {
  static currTriggers: string[];
  constructor() {}

  // add different scenarios and a resolver
  static resolver(oldImage: IDispute | null, newImage: IDispute): string[] {
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
const checkTwo = (oldImage: IDispute | null, newImage: IDispute): boolean => {
  // return true;
  const currOpenedOn = newImage.openedOn;
  const currDate = new Date(currOpenedOn || 0);

  if (oldImage == null && currDate.toString().toLowerCase() !== 'invalid date') {
    return true;
  }
  return false;
};

/**
 * Check for existing disputes that have completed (changed status) from the alert notification
 * @param oldImage
 * @param newImage
 * @returns
 */
const checkThree = (oldImage: IDispute | null, newImage: IDispute): boolean => {
  if (oldImage == null) return false;
  // return true;
  const priorClosedOn = oldImage.closedOn;
  const currClosedOn = newImage.closedOn;
  const priorStatus = oldImage.disputeStatus || '';
  const currStatus = newImage.disputeStatus || '';

  const priorDate = new Date(priorClosedOn || 0);
  const currDate = new Date(currClosedOn || 0);
  const t1 = currDate.toString().toLowerCase() !== 'invalid date';
  const t2 = currDate.valueOf() - priorDate.valueOf() > 0;
  const t3 = currStatus !== priorStatus;
  const t4 = currStatus.toLowerCase() === 'completedispute' || currStatus.toLowerCase() === 'cancelleddispute';
  if (t1 && t2 && t3 && t4) {
    return true;
  }
  return false;
};

/**
 * Check for disputes that have completed from the alert notification
 * @param oldImage
 * @param newImage
 * @returns
 */
const checkFour = (oldImage: IDispute | null, newImage: IDispute): boolean => {
  if (oldImage !== null) return false;
  // return true;
  const currStatus = newImage.disputeStatus || '';

  const t1 = currStatus.toLowerCase() === 'completedispute' || currStatus.toLowerCase() === 'cancelleddispute';
  if (t1) {
    return true;
  }
  return false;
};

const triggerLibrary: Record<string, (oldImage: IDispute | null, newImage: IDispute) => boolean> = {
  [MailchimpTriggerEmails.DisputeSubmitted]: checkTwo,
  [MailchimpTriggerEmails.DisputeResultsReady]: checkThree,
  [MailchimpTriggerEmails.DisputeResultsReady]: checkFour,
};
