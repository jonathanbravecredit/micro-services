import { ITradeLinePartition } from '../../_types/merge-report';
import { CreditReportGroups, CREDIT_REPORT_GROUPS } from '../../_constants/transunion';

export class TransunionFilters {
  constructor() {}

  /**
   * Filters by a set of provided pay statuses
   * @param tradelines
   * @param codes
   * @returns
   */
  static filterTradelinesByStatusCodes(
    tradelines: ITradeLinePartition[],
    codes: Record<string, any>,
  ): ITradeLinePartition[] {
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
  static filterTradelinesByIndustryCode(tradelines: ITradeLinePartition[], code: string): ITradeLinePartition[] {
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
  static filterTradelinesByType(tradelines: ITradeLinePartition[], type: string): ITradeLinePartition[] | [] {
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
   * @param {ITradeLinePartition[]} tradeLines
   * @returns
   */
  static filterTradelinesByCreditReportGroups(
    tradeLines: ITradeLinePartition[],
    filters: CreditReportGroups[],
  ): ITradeLinePartition[] {
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
