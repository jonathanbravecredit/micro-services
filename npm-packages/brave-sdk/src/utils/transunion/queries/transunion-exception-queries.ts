import { TRANSUNION_ERROR_CODES, TRANSUNION_CRITICAL_ERRORS } from '../../../constants';
import { ITransunionErrorCode, ITUServiceResponse } from '../../../types';

export class TransunionExceptionQueries {
  constructor() {}

  static getErrorCodeDetails(code: string): ITransunionErrorCode {
    const detail = TRANSUNION_ERROR_CODES[code];
    return !detail
      ? TRANSUNION_ERROR_CODES['11'] // non-specific error
      : detail;
  }

  static isErrorCritical(resp: ITUServiceResponse<any>): boolean {
    const { error: { Code, Message, Name } = {} } = resp;
    const { keyWords } = TRANSUNION_CRITICAL_ERRORS[`${Code}`] || {};
    if (!keyWords) return false;
    const found = keyWords.find((w) => {
      const msg = Message?.toLowerCase() || '';
      const name = Name?.toLowerCase() || '';
      const word = w.toLowerCase();
      return msg.indexOf(word) >= 0 || name.indexOf(word) >= 0;
    });
    return found ? true : false;
  }

  static isPinStale(pinAge: number): boolean {
    // 15 minutes in millisends...is now in milliseconds greater than the age
    const _MS_MINS = 15 * 60 * 1000;
    const now = new Date();
    const ms = now.valueOf();
    return ms - pinAge >= _MS_MINS;
  }

  static isKBAStale(kbaAge: number): boolean {
    // 96 hours in milliseconds...is now in ms greater than age
    const _MS_HOURS = 96 * 60 * 60 * 1000;
    const now = new Date();
    const ms = now.valueOf();
    return ms - kbaAge >= _MS_HOURS;
  }
}
