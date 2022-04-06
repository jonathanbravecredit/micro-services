import { IRemark } from '../../../types/common-tu';
import { TransunionMissing } from '../transunion-missing';
import { NAME_MAP, ADDRESS_LINE_1, ADDRESS_LINE_2 } from '../../../constants/transunion';
import {
  IBorrower,
  IBorrowerName,
  ICreditAddress,
  ICreditStatement,
  IEmployer,
  IPhoneNumber,
  ISubscriber,
} from '../../../types/merge-report';

export class TransunionReportParsers extends TransunionMissing {
  constructor() {
    super();
  }

  /**
   * Flatten the remarks into one paragraph
   * @param remarks
   * @returns
   */
  static parseRemarks(remarks: IRemark | IRemark[] | undefined): string {
    if (remarks === undefined) return '';
    return remarks instanceof Array
      ? remarks
          .map((r) => r.RemarkCode?.description || '')
          .reduce((a, b) => {
            return `${a} \n ${b}`;
          }, '')
      : remarks.RemarkCode?.description || '';
  }

  /**
   * Flatten the credit statement provided by the borrower
   */
  static parseBorrowerForCreditStatement(borrower: IBorrower | undefined): string | null | undefined {
    if (!borrower) return;
    return borrower instanceof Array
      ? this.parseCreditStatement(borrower[0].CreditStatement)
      : this.parseCreditStatement(borrower.CreditStatement);
  }

  /**
   * Flatten the credit statement provided by the borrower
   */
  private static parseCreditStatement(creditStatement: ICreditStatement[] | undefined): string | null | undefined {
    if (!creditStatement) return;
    return creditStatement[0]?.statement;
  }

  /**
   * Reconstitutes the borrower name into one string
   * @param borrowerName
   * @returns
   */
  static unparseName(borrowerName: IBorrowerName | undefined): string {
    if (!borrowerName) return this.bcMissing;
    if (!borrowerName.Name) return this.bcMissing;
    const name: Record<string, any> = borrowerName.Name;
    if (!name) return this.bcMissing;
    let fullName = '';
    for (const key in NAME_MAP) {
      const str = !!name[key] ? `${name[key]} ` : '';
      fullName = `${fullName}${str}`;
    }
    return fullName;
  }

  /**
   * Reconstitutes the borrower employers with address into one string with line break
   * @param employer
   * @returns
   */
  static unparseEmployer(employer: IEmployer | undefined): string {
    if (!employer) return this.bcMissing;
    if (!employer.name) return this.bcMissing;

    let empAddress = employer.CreditAddress ? `\n${this.unparseAddress(employer.CreditAddress)}` : '';
    empAddress = empAddress.trim() === ',' ? '' : empAddress;
    let str = `${employer.name}${empAddress}`;
    return str;
  }

  /**
   * Reconstitutes the borrower phone number into one string with area code and extension
   * @param phone
   * @returns
   */
  static unparsePhone(phone: IPhoneNumber | undefined): string {
    if (!phone) return this.bcMissing;
    let area = phone.AreaCode ? `${phone.AreaCode}` : '000';
    let main = phone.Number ? `${phone.Number}` : '';
    const digits = `${area}${main}`.replace(/[^0-9]/g, '');
    if (!digits) return '';
    return digits;
  }

  /**
   * Reconstitutes the merge report subscriber name, address, and phone
   * @param subscriber
   * @returns
   */
  static unparseSubscriber(
    subscriber: ISubscriber | undefined | null,
    nameOverride?: string,
  ): [string?, string?, string?] {
    if (!subscriber) return [0, 0, 0].map((x) => this.bcMissing) as [string, string, string];
    const name = nameOverride ? nameOverride : subscriber.name;
    const address = this.unparseAddress(subscriber.CreditAddress);
    const phone = subscriber.telephone;
    const filtered = [name, address, phone].filter((x) => x && x.length > 0) as [string, string, string];
    return filtered;
  }

  /**
   * Reconstitutes the borrower address into one string with line break
   * @param address
   * @returns
   */
  static unparseAddress(address: ICreditAddress | undefined): string {
    if (!address) return '';
    let records: Record<string, any> = address;
    let creditAddress = '';
    for (const key in ADDRESS_LINE_1) {
      const str = !!records[key] ? `${records[key]} ` : '';
      creditAddress = `${creditAddress}${str}`;
    }
    creditAddress = `${creditAddress.trim()} \n`;
    for (const key in ADDRESS_LINE_2) {
      let comma = key !== 'postalCode' ? ', ' : '';
      const str = !!records[key] ? `${records[key]}${comma}` : '';
      creditAddress = `${creditAddress}${str}`;
    }
    return creditAddress;
  }
}
