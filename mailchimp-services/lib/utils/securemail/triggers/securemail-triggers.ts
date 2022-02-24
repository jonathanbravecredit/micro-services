import { IDispute } from 'lib/interfaces';
import { SecuremailTriggerEmails, SecureMailTriggerGenerators } from 'lib/utils/securemail/constants';

export class SecureMailTriggers {
  static currTriggers: string[];
  constructor() {}

  // add different scenarios and a resolver
  static resolver(oldImage: IDispute, newImage: IDispute): string[] {
    let triggers: string[] = [];
    let letterContent = newImage.disputeLetterContent;
    for (let key in triggerLibrary) {
      if (triggerLibrary[key](oldImage, newImage)) {
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

const triggerLibrary: Record<string, (oldImage: IDispute, newImage: IDispute) => boolean> = {
  [SecuremailTriggerEmails.PVItems]: checkOne,
};
