import { IBreachCard } from '../../../types/breach-card';
import { TransunionMissing } from '../transunion-missing';
import { DataBreachConditions } from './conditions';
import {
  BRAVE_ACCOUNT_TYPE,
  FORBEARANCE_TYPE,
  NEGATIVE_PAY_STATUS_CODES,
  POSITIVE_PAY_STATUS_CODES,
  DataBreaches,
  DATA_BREACH_CARDS,
  AccountTypes,
  ACCOUNT_TYPES,
} from '../../../constants/transunion';
import {
  IBorrower,
  IBorrowerAddress,
  IInquiryPartition,
  IMergeReport,
  IPublicPartition,
  ISubscriber,
  ITradeLinePartition,
} from '../../../types/merge-report';

export class TransunionReportQueries extends TransunionMissing {
  constructor() {
    super();
  }

  /*===================================*/
  //           MESSAGE
  /*===================================*/

  static isReportSupressed(report: IMergeReport | null): boolean {
    if (!report) return false;
    let res = report.TrueLinkCreditReportType?.Message?.find((ele) => {
      ele.Code?.abbreviation === 'Credit data suppressed';
    });
    return res ? true : false;
  }

  /*===================================*/
  //           TRADELINE RECORDS
  /*===================================*/

  /**
   * Helper function to securely lookup the account type, falls back to pay status.
   * @param {ITradeLinePartition | undefined} partition
   * @returns
   */
  static listTradelines(report: IMergeReport | null): ITradeLinePartition[] | [] {
    if (!report) return [];
    const partition = report.TrueLinkCreditReportType?.TradeLinePartition;
    if (partition === undefined) return [];
    if (partition instanceof Array) {
      return partition;
    } else {
      return [partition];
    }
  }

  /**
   * Helper function to securely lookup the account type, falls back to pay status.
   * @param {ITradeLinePartition | undefined} partition
   * @returns
   */
  static getBraveTradelineDescription(partition: ITradeLinePartition | undefined): string {
    if (!partition) return this.bcMissing;
    const description = partition.accountTypeDescription;
    const status = BRAVE_ACCOUNT_TYPE[`${partition.Tradeline?.PayStatus?.symbol}`];
    return partition.accountTypeSymbol?.toLowerCase() === 'y' ? description || this.bcMissing : status;
  }

  /**
   * Helper function to securely lookup the account type, falls back to pay status.
   * @param {ITradeLinePartition | undefined} partition
   * @returns
   */
  static getTradelineTypeDescription(partition: ITradeLinePartition | undefined): AccountTypes {
    if (!partition) return AccountTypes.Unknown;
    const description = ACCOUNT_TYPES[`${partition.accountTypeSymbol?.toLowerCase()}`];
    return description ? description : AccountTypes.Unknown;
  }

  /**
   * Helper function to calculate the max delinquency.
   * @param {ITradeLinePartition | undefined} partition
   * @returns
   */
  static getDelinquencyCount(partition: ITradeLinePartition | undefined): number {
    if (!partition) return 0;
    const count30 = partition.Tradeline?.GrantedTrade?.late30Count || 0;
    const count60 = partition.Tradeline?.GrantedTrade?.late60Count || 0;
    const count90 = partition.Tradeline?.GrantedTrade?.late90Count || 0;
    return +count30 + +count60 + +count90;
  }

  /*===================================*/
  //           CREDITOR RECORDS
  /*===================================*/
  /**
   * Helper function to securey look up the original creditor
   * @param {ITradeLinePartition | undefined} partition
   * @returns
   */
  static getOriginalCreditor(partition: ITradeLinePartition | undefined | null): string {
    if (!partition) return this.bcMissing;
    const originalCreditor = partition.Tradeline?.CollectionTrade?.originalCreditor;
    const creditorName = partition.Tradeline?.creditorName || this.bcMissing;
    if (partition.accountTypeSymbol?.toLowerCase() === 'y') {
      return originalCreditor ? originalCreditor : creditorName;
    } else {
      return creditorName;
    }
  }

  /**
   * Helper function to securey look up the original creditor
   * @param {ITradeLinePartition | undefined} partition
   * @returns
   */
  static getCreditor(partition: ITradeLinePartition | undefined | null): string {
    if (!partition) return this.bcMissing;
    return partition.Tradeline?.creditorName || this.bcMissing;
  }

  /*=====================================*/
  //            ISubscriber
  /*=====================================*/
  /**
   * Get the ISubscriber from the merge report by tradeline ISubscriber key
   * @param tradeline
   * @param subs
   * @returns
   */
  static getTradelineISubscriberByKey(
    tradeline: ITradeLinePartition | undefined,
    subs: ISubscriber[] = [],
  ): ISubscriber | undefined {
    const code = tradeline?.Tradeline?.subscriberCode;
    if (!code || !tradeline) return;
    return subs.find((sub) => {
      return sub.subscriberCode == code;
    });
  }

  /**
   * Get the ISubscriber from the merge report by publicItem ISubscriber key
   * @param publicItem
   * @param subs
   * @returns
   */
  static getPublicISubscriberByKey(
    publicItem: IPublicPartition | undefined,
    subs: ISubscriber[] = [],
  ): ISubscriber | undefined {
    const code = publicItem?.PublicRecord?.subscriberCode;
    if (!code || !publicItem) return;
    return subs.find((sub) => {
      return sub.subscriberCode == code;
    });
  }

  /*=====================================*/
  //            ISubscriber
  /*=====================================*/
  /**
   * Get the ISubscriber from the merge report by tradeline ISubscriber key
   * @param tradeline
   * @param subs
   * @returns
   */
  static listISubscribers(report: IMergeReport): ISubscriber[] | [] {
    const ISubscribers = report.TrueLinkCreditReportType?.Subscriber;
    if (ISubscribers instanceof Array) return ISubscribers;
    if (ISubscribers === undefined) return [];
    return [ISubscribers];
  }

  /*=====================================*/
  //            DISPUTE FLAG
  /*=====================================*/
  /**
   * Helper function to securely look up the dispute flag
   * @param {ITradeLinePartition | undefined} partition
   * @returns
   */
  static getDisputeFlag(partition: ITradeLinePartition | undefined): string {
    if (!partition) return 'No';
    const symbol = partition.Tradeline?.DisputeFlag?.description || 'not';
    return symbol.indexOf('not') === -1 ? 'Yes' : 'No';
  }

  /*=====================================*/
  //            ACCOUNT TYPE
  /*=====================================*/
  /**
   * Helper function to securely lookup the account type
   * @param {ITradeLinePartition | undefined} partition
   * @returns
   */
  static getAccountType(partition: ITradeLinePartition | undefined): string {
    if (!partition) return 'unknown';
    const description = partition.accountTypeDescription;
    const status = BRAVE_ACCOUNT_TYPE[`${partition.Tradeline?.PayStatus?.symbol}`];
    return partition.accountTypeSymbol?.toLowerCase() === 'y' ? description || 'No Data / Unknown' : status;
  }

  /**
   * Helper function to securely lookup the account type
   * @param {ITradeLinePartition | undefined} partition
   * @returns
   */
  static isForbearanceAccount(partition: ITradeLinePartition | undefined): boolean {
    if (!partition) return false;
    const { accountTypeSymbol = '' } = partition;
    if (!accountTypeSymbol) return false;
    const accountType = FORBEARANCE_TYPE[accountTypeSymbol.toLowerCase()];
    if (!accountType) return false;
    if (accountTypeSymbol.toLowerCase() === 'm') return true; // simple mortgage
    const { Tradeline: { GrantedTrade: { AccountType: { symbol = '', description = '' } = {} } = {} } = {} } =
      partition;
    if (`${symbol}`.toLowerCase() === 'st') {
      return true;
    }
    return false;
  }

  /**
   * Helper function to check if the tradeline is a student loan account
   * @param partition
   * @returns
   */
  static isStudentLoanAccount(partition: ITradeLinePartition | undefined): boolean {
    if (!partition) return false;
    const industry = partition.Tradeline?.IndustryCode?.description;
    if (industry?.toLowerCase().includes('student')) {
      return true;
    }
    return false;
  }

  /**
   * Helper function to securely lookup the account type
   * @param {ITradeLinePartition | undefined} partition
   * @returns
   */
  static isNegativeAccount(partition: ITradeLinePartition | undefined): boolean {
    if (!partition) return false;
    const symbol = partition.Tradeline?.PayStatus?.symbol;
    if (!symbol) return false;
    return !!NEGATIVE_PAY_STATUS_CODES[`${symbol}`] || false;
  }

  /**
   * Helper function to securely lookup the account type
   * @param {ITradeLinePartition | undefined} partition
   * @returns
   */
  static isPositiveAccount(partition: ITradeLinePartition | undefined): boolean {
    if (!partition) return false;
    const symbol = partition.Tradeline?.PayStatus?.symbol;
    if (!symbol) return false;
    return !!POSITIVE_PAY_STATUS_CODES[`${symbol}`] || false;
  }

  /**
   * Checks whether the report has items that fall under any of the known databreaches
   *  - condition 1 lives in california and has car loan
   *  - condition 2 lives in california
   *  - condition 3 lives in colorado
   *  - condition 4 lives in [35 states]...just do it for everyone for now
   *  - condition 5 found T-Mobile in inquiries
   *  - condition 6 lives in washington
   *  - condition 7 lives in experian state
   * @param report
   * @param condition
   * @returns
   */
  static isDataBreachCondition(report: IMergeReport, condition: string): DataBreaches {
    if (!report) return DataBreaches.None;
    const IBorrower = report.TrueLinkCreditReportType?.Borrower;
    const address = this.getCurrentAddress(IBorrower || {});
    const tradelines = this.listTradelines(report);
    const inquiries = this.listInquiries(report);

    switch (condition) {
      case DataBreaches.Condition1:
        // Check if living in California and have car loans
        return DataBreachConditions[DataBreaches.Condition1]({ address, tradelines });
        break;
      case DataBreaches.Condition2:
        // Check if living in California
        return DataBreachConditions[DataBreaches.Condition2]({ address });
        break;
      case DataBreaches.Condition3:
        // Check if living in Colorado
        return DataBreachConditions[DataBreaches.Condition3]({ address });
        break;
      case DataBreaches.Condition4:
        // Check if living in a Kroger state
        return DataBreachConditions[DataBreaches.Condition4]({ address, tradelines });
        break;
      case DataBreaches.Condition5:
        // Check for soft/hard inquiries with T Mobile
        return DataBreachConditions[DataBreaches.Condition5]({ inquiries });
        break;
      case DataBreaches.Condition6:
        // Check if living in Washington
        return DataBreachConditions[DataBreaches.Condition6]({ address });
        break;
      case DataBreaches.Condition7:
        // Check if living in Washington
        return DataBreachConditions[DataBreaches.Condition7]({ address });
        break;
      default:
        return DataBreaches.None;
        break;
    }
  }

  /**
   * Go through the data breaches identified and determine if the credit report matches any condtions
   * @param report
   * @returns
   */
  static listDataBreaches(report: IMergeReport): IBreachCard[] {
    const breachCards = Object.values(DataBreaches)
      .filter((item) => {
        return this.isDataBreachCondition(report, item) !== DataBreaches.None;
      })
      .map((key) => {
        return DATA_BREACH_CARDS[key];
      });
    return breachCards;
  }

  /*=====================================*/
  //            Personal Info
  /*=====================================*/
  /**
   * Get the current IBorrower address
   * @param IBorrower
   * @returns
   */
  static getCurrentAddress(IBorrower: IBorrower): IBorrowerAddress | undefined {
    const address = IBorrower?.BorrowerAddress;
    if (address === undefined) return;
    if (address instanceof Array) {
      return address.sort((a, b) => {
        return (a.addressOrder || 99) - (b.addressOrder || 99);
      })[0];
    } else {
      return address;
    }
  }

  /*=====================================*/
  //            Inquiries
  /*=====================================*/
  /**
   * Helper function to consistently pull inquiry partitions
   * @param report
   * @returns
   */
  static listInquiries(report: IMergeReport): IInquiryPartition[] | [] {
    if (!report) return [];
    const inquiries = report.TrueLinkCreditReportType?.InquiryPartition;
    if (inquiries === undefined) return [];
    if (inquiries instanceof Array) {
      return inquiries;
    } else {
      return [inquiries];
    }
  }
}
