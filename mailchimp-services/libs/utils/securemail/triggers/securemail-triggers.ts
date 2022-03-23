import { IDispute } from 'libs/interfaces';
import { SecuremailTriggerEmails } from 'libs/utils/securemail/constants';
import { TEMPLATE_LIBRARY } from 'libs/utils/securemail/generators';
import { ISecureMailData, ISecureMailPacket } from 'libs/utils/securemail/interfaces';

export class SecureMailTriggers {
  static currTriggers: ISecureMailPacket<ISecureMailData>[];
  constructor() {}

  // add different scenarios and a resolver
  static resolver(
    oldImage: IDispute | null,
    newImage: IDispute,
    event: 'INSERT' | 'MODIFY',
  ): ISecureMailPacket<ISecureMailData>[] {
    let triggers: ISecureMailPacket<ISecureMailData>[] = [];
    for (let key in triggerLibrary) {
      const { data, test } = triggerLibrary[key](oldImage, newImage, event);
      triggers = test && data ? (triggers = [...triggers, { template: key, data: data }]) : triggers;
    }
    this.currTriggers = triggers; // store for reference
    return triggers;
  }
}

/**
 * Check for PV submitted disputes
 * @param oldImage
 * @param newImage
 * @returns
 */
const checkOne = (
  oldImage: IDispute | null,
  newImage: IDispute,
  event: 'INSERT' | 'MODIFY',
): { test: boolean; data?: ISecureMailData } => {
  // return true;
  if (event !== 'MODIFY') return { test: false };
  if (!oldImage) return { test: false };
  const priorLetterCode = oldImage.disputeLetterCode || '';
  const currLetterCode = newImage.disputeLetterCode || '';
  const t1 = priorLetterCode.toLowerCase().indexOf('pvc');
  const t2 = currLetterCode.toLowerCase().indexOf('pvc');
  const content = newImage.disputeLetterContent || '';
  console.log('check one: ', t1, ' ', t2);
  const payload = TEMPLATE_LIBRARY[SecuremailTriggerEmails.PVItems].replace('####', content || '');
  if (!(t1 >= 0) && t2 >= 0) {
    return {
      test: true,
      data: {
        api: 'securemail',
        payload: payload,
        from: 'support@brave.credit',
        subject: 'Dispute Status Update',
      },
    }; // might need to return a generator;
  }
  return { test: false };
};

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
): { test: boolean; data?: ISecureMailData } => {
  if (event !== 'INSERT') return { test: false };
  const currOpenedOn = newImage.openedOn;
  const currDate = new Date(currOpenedOn);
  const t2 = currDate.toString().toLowerCase() !== 'invalid date';
  console.log('check two: ', t2);
  const payload = TEMPLATE_LIBRARY[SecuremailTriggerEmails.DisputeSubmitted];
  if (t2) {
    return {
      test: true,
      data: {
        api: 'securemail',
        payload: payload,
        from: 'support@brave.credit',
        subject: 'Your Dispute Is On Its Way!',
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
): { test: boolean; data?: ISecureMailData } => {
  // return { test: false };
  if (event !== 'MODIFY') return { test: false };
  if (!oldImage || !newImage) return { test: false };
  const currStatus = newImage.disputeStatus || '';
  const oldIR = oldImage.disputeInvestigationResults;
  const newIR = newImage.disputeInvestigationResults;
  // const t3 = currStatus !== priorStatus; // The status has changed
  const t4 = currStatus.toLowerCase() === 'completedispute' || currStatus.toLowerCase() === 'cancelleddispute'; // status has to be complete or cancelled
  const t5 = oldIR !== newIR;
  // console.log('t3: ', t3);
  console.log('t4: ', t4);
  console.log('t5: ', t5);
  const payload = TEMPLATE_LIBRARY[SecuremailTriggerEmails.DisputeResultsReady];
  console.log('check three: ', t4, ' ', t5);
  if (t4 && t5) {
    return {
      test: true,
      data: {
        api: 'securemail',
        payload: payload,
        from: 'support@brave.credit',
        subject: 'Dispute Investigation Results Now Available at Brave Credit',
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
  ) => { test: boolean; data?: ISecureMailData }
> = {
  [SecuremailTriggerEmails.PVItems]: checkOne,
  [SecuremailTriggerEmails.DisputeSubmitted]: checkTwo,
  [SecuremailTriggerEmails.DisputeResultsReady]: checkThree,
};
