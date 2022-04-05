import { CreditReportGroups, CREDIT_REPORT_GROUPS } from '../../../constants/transunion';
import { TradeLinePartition } from '../../../models/merge-report';

export class TransunionFilters {
  constructor() {}

  /**
   * Filters by a set of provided pay statuses
   * @param tradelines
   * @param codes
   * @returns
   */
  static filterTradelinesByStatusCodes(
    tradelines: TradeLinePartition[],
    codes: Record<string, any>,
  ): TradeLinePartition[] {
    return tradelines.filter((item) => {
      let status = codes[`${item.Tradeline?.PayStatus?.symbol}`];
      return !!status;
    });
  }

  /**
   * Filters by an industry code
   * @param tradelines
   * @param code
   * @returns
   */
  static filterTradelinesByIndustryCode(tradelines: TradeLinePartition[], code: string): TradeLinePartition[] {
    return tradelines.filter((item) => {
      let result = `${item?.Tradeline?.IndustryCode?.symbol || ''}`.toLowerCase() === code.toLowerCase();
      return result;
    });
  }

  /**
   * Filter by an account type symbol TradeLinePartition.accountTypeSymbol
   * @param tradelines
   * @param type
   * @returns
   */
  static filterTradelinesByType(tradelines: TradeLinePartition[], type: string): TradeLinePartition[] | [] {
    return tradelines.filter((item) => {
      let result = `${item?.accountTypeSymbol || ''}`.toLowerCase() === type;
      return result;
    });
  }

  /*=====================================*/
  //         CREDIT REPORT GROUPS
  /*=====================================*/
  /**
   * Sorts the tradeline by the account type
   * @param {TradeLinePartition[]} tradeLines
   * @returns
   */
  static filterTradelinesByCreditReportGroups(
    tradeLines: TradeLinePartition[],
    filters: CreditReportGroups[],
  ): TradeLinePartition[] {
    const _filters: Record<any, boolean> = {};
    filters.forEach((item) => (_filters[`${item}`] = true));
    const results = tradeLines.filter((item) => {
      const symbol = item.accountTypeSymbol?.toLowerCase();
      const group = CREDIT_REPORT_GROUPS[symbol || ''];
      if (!symbol || !group) return 0;
      return _filters[group.group];
    });
    return results;
  }
}
