import { IDispute } from 'lib/interfaces';
import { MailchimpTriggerEmails } from 'lib/utils/mailchimp/constants';
import { IMailchimpPacket, ITransactionalData } from 'lib/utils/mailchimp/interfaces';

export class MailchimpDisputeTriggers {
  static currTriggers: IMailchimpPacket<ITransactionalData>[];
  constructor() {}

  // add different scenarios and a resolver
  static resolver(
    oldImage: IDispute | null,
    newImage: IDispute,
    event: 'INSERT' | 'MODIFY',
  ): IMailchimpPacket<ITransactionalData>[] {
    let triggers: IMailchimpPacket<ITransactionalData>[] = [];
    for (let key in triggerLibrary) {
      const { data, test } = triggerLibrary[key](oldImage, newImage, event);
      triggers = test ? (triggers = [...triggers, { template: key, data: data }]) : triggers;
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
const checkTwo = (
  oldImage: IDispute | null,
  newImage: IDispute,
  event: 'INSERT' | 'MODIFY',
): { test: boolean; data?: ITransactionalData } => {
  if (event !== 'INSERT') return { test: false };
  console.log('CheckTwo newImage: ', JSON.stringify(newImage));
  const currOpenedOn = newImage.openedOn;
  const currDate = new Date(currOpenedOn);
  const t2 = currDate.toString().toLowerCase() !== 'invalid date';

  if (t2) {
    return {
      test: true,
      data: {
        api: 'transactional',
      },
    };
  }
  return { test: false };
};

const checkThreeFour = (
  oldImage: IDispute | null,
  newImage: IDispute,
  event: 'INSERT' | 'MODIFY',
): { test: boolean; data?: ITransactionalData } => {
  const t3 = checkThree(oldImage, newImage, event);
  const t4 = checkFour(oldImage, newImage, event);
  if (t3.test || t4.test) {
    return {
      test: true,
      data: {
        api: 'transactional',
      },
    };
  }
  return { test: false };
};

/**
 * Check for disputes that have:
 *  1. autocompleted and have had their IR updated (a MODIFY event), or...
 *  2. dispute status changed (a MODIFY event) from the alert notification and had their IR results updated
 * @param oldImage
 * @param newImage
 * @returns
 */
const checkThree = (
  oldImage: IDispute | null,
  newImage: IDispute,
  event: 'INSERT' | 'MODIFY',
): { test: boolean; data?: ITransactionalData } => {
  // return { test: false };
  if (event !== 'MODIFY') return { test: false };
  console.log('oldImage ==> ', JSON.stringify(oldImage));
  console.log('newImage ==> ', JSON.stringify(newImage));
  const currStatus = newImage.disputeStatus || '';
  const oldIR = oldImage?.disputeInvestigationResults;
  const newIR = newImage?.disputeInvestigationResults;
  console.log('oldIR: ', oldIR);
  console.log('newIR: ', newIR);
  // const t3 = currStatus !== priorStatus; // The status has changed
  const t4 = currStatus.toLowerCase() === 'completedispute' || currStatus.toLowerCase() === 'cancelleddispute'; // status has to be complete or cancelled
  const t5 = oldIR !== newIR;
  // console.log('t3: ', t3);
  console.log('t4: ', t4);
  console.log('t5: ', t5);
  if (t4 && t5) {
    return {
      test: true,
      data: {
        api: 'transactional',
      },
    };
  }
  return { test: false };
};

/**
 * Check for new disputes that have auto completed
 * @param oldImage
 * @param newImage
 * @returns
 */
const checkFour = (
  oldImage: IDispute | null,
  newImage: IDispute,
  event: 'INSERT' | 'MODIFY',
): { test: boolean; data?: ITransactionalData } => {
  return { test: false }; // not needed anymore as investigation result on autoclose will trigger the modify email in checkThree
  if (event !== 'INSERT') return { test: false };
  const currStatus = newImage.disputeStatus || '';

  const t1 = currStatus.toLowerCase() === 'completedispute' || currStatus.toLowerCase() === 'cancelleddispute';
  if (t1) {
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
  (
    oldImage: IDispute | null,
    newImage: IDispute,
    event: 'INSERT' | 'MODIFY',
  ) => { test: boolean; data?: ITransactionalData }
> = {
  [MailchimpTriggerEmails.DisputeSubmitted]: checkTwo,
  [MailchimpTriggerEmails.DisputeResultsReady]: checkThreeFour,
};
