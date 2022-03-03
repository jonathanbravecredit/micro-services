import { IDispute } from 'lib/interfaces';
import { SecuremailTriggerEmails, SecureMailTriggerGenerators } from 'lib/utils/securemail/constants';

export class SecureMailTriggers {
  static currTriggers: string[];
  constructor() {}

  // add different scenarios and a resolver
  static resolver(oldImage: IDispute, newImage: IDispute, event: 'INSERT' | 'MODIFY'): string[] {
    let triggers: string[] = [];
    let letterContent = newImage.disputeLetterContent;
    for (let key in triggerLibrary) {
      if (triggerLibrary[key](oldImage, newImage, event)) {
        triggers = [...triggers, SecureMailTriggerGenerators[key](letterContent)];
      }
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
const checkOne = (oldImage: IDispute, newImage: IDispute): boolean => {
  // return true;
  const priorLetterCode = oldImage.disputeLetterCode || '';
  const currLetterCode = newImage.disputeLetterCode || '';
  const t1 = priorLetterCode.toLowerCase().indexOf('pvc');
  const t2 = currLetterCode.toLowerCase().indexOf('pvc');
  if (!(t1 >= 0) && t2 >= 0) {
    return true; // might need to return a generator;
  }
  return false;
};

/**
 * Check for new disputes started
 * @param oldImage
 * @param newImage
 * @returns
 */
const checkTwo = (oldImage: IDispute | null, newImage: IDispute, event: 'INSERT' | 'MODIFY'): boolean => {
  if (event !== 'INSERT') return false;
  console.log('CheckTwo newImage: ', JSON.stringify(newImage));
  const currOpenedOn = newImage.openedOn;
  const currDate = new Date(currOpenedOn);
  const t2 = currDate.toString().toLowerCase() !== 'invalid date';
  return t2;
};

/**
 * Check for disputes that have:
 *  1. autocompleted and have had their IR updated (a MODIFY event), or...
 *  2. dispute status changed (a MODIFY event) from the alert notification and had their IR results updated
 * @param oldImage
 * @param newImage
 * @returns
 */
const checkThree = (oldImage: IDispute | null, newImage: IDispute, event: 'INSERT' | 'MODIFY'): boolean => {
  // return { test: false };
  if (event !== 'MODIFY') return false;
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
  return t4 && t5;
};

const triggerLibrary: Record<string, (oldImage: IDispute, newImage: IDispute, event: 'INSERT' | 'MODIFY') => boolean> =
  {
    [SecuremailTriggerEmails.PVItems]: checkOne,
    [SecuremailTriggerEmails.DisputeSubmitted]: checkTwo,
    [SecuremailTriggerEmails.DisputeResultsReady]: checkThree,
  };
