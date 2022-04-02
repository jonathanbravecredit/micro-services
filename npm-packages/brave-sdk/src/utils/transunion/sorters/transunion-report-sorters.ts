import { CREDIT_REPORT_GROUPS, POSITIVE_PAY_STATUS_CODES } from '../../../constants/transunion';
import { TradeLinePartition } from '../../../models/merge-report';

export class TransunionReportSorters {
  constructor() {}

  /*=====================================*/
  //            ACCOUNT TYPE
  /*=====================================*/
  /**
   * Sorts the tradeline by the account type
   * @param {TradeLinePartition[]} tradeLines
   * @returns
   */
  static sortTradelineByAccountType(tradeLines: TradeLinePartition[]): TradeLinePartition[] {
    return [
      ...tradeLines.sort((a, b) => {
        if (a.accountTypeSymbol?.toLowerCase() === 'y' && b.accountTypeDescription?.toLowerCase() !== 'y') {
          return 1;
        }
        if (a.accountTypeSymbol?.toLowerCase() !== 'y' && b.accountTypeDescription?.toLowerCase() === 'y') {
          return -1;
        }
        return 0;
      }),
    ];
  }

  /*=====================================*/
  //         CREDIT REPORT GROUPS
  /*=====================================*/
  /**
   * Sorts the tradeline by the account type
   * @param {TradeLinePartition[]} tradeLines
   * @returns
   */
  static sortByCreditReportGroups(tradeLines: TradeLinePartition[]): TradeLinePartition[] {
    return tradeLines.sort((a, b) => {
      const symA = a.accountTypeSymbol?.toLowerCase();
      const symB = b.accountTypeSymbol?.toLowerCase();
      if (!symA || !symB) return 0;
      return CREDIT_REPORT_GROUPS[symA]['order'] - CREDIT_REPORT_GROUPS[symB]['order'];
    });
  }

  /*=====================================*/
  //            DATE OPENED
  /*=====================================*/
  /**
   * Sorts the tradeline by the date opened keeping the sort by account type
   * @param {TradeLinePartition[]} tradeLines
   * @returns
   */
  static sortTradelineByDateOpened(tradeLines: TradeLinePartition[]): TradeLinePartition[] {
    return [
      ...tradeLines.sort((a, b) => {
        if (a.accountTypeSymbol !== b.accountTypeSymbol) {
          return 0;
        }
        if (a.Tradeline?.dateOpened! < b.Tradeline?.dateOpened!) {
          return 1;
        }
        if (a.Tradeline?.dateOpened! > b.Tradeline?.dateOpened!) {
          return -1;
        }
        return 0;
      }),
    ];
  }

  /*=====================================*/
  //            PAY STATUS
  /*=====================================*/
  /**
   * Sorts the tradeline by the account type (negative first by default)
   * @param tradeLines
   * @param positive optional flag to switch the order to positive first
   * @returns
   */
  static sortTradelineByPayStatus(tradeLines: TradeLinePartition[], positive: boolean = false): TradeLinePartition[] {
    const sort = positive ? 1 : -1;
    return [
      ...tradeLines.sort((a, b) => {
        const statusA = POSITIVE_PAY_STATUS_CODES[`${a.Tradeline?.PayStatus?.symbol}`] ? -1 * sort : 1 * sort;
        const statusB = POSITIVE_PAY_STATUS_CODES[`${b.Tradeline?.PayStatus?.symbol}`] ? -1 * sort : 1 * sort;
        return statusA - statusB;
      }),
    ];
  }
}
