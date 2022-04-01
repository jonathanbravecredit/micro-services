import { ITradeLinePartition } from '../../_types/merge-report';
import { CreditReportGroups } from '../../_constants/transunion';
export declare class TransunionFilters {
    constructor();
    /**
     * Filters by a set of provided pay statuses
     * @param tradelines
     * @param codes
     * @returns
     */
    static filterTradelinesByStatusCodes(tradelines: ITradeLinePartition[], codes: Record<string, any>): ITradeLinePartition[];
    /**
     * Filters by an industry code
     * @param tradelines
     * @param code
     * @returns
     */
    static filterTradelinesByIndustryCode(tradelines: ITradeLinePartition[], code: string): ITradeLinePartition[];
    /**
     * Filter by an account type symbol TradeLinePartition.accountTypeSymbol
     * @param tradelines
     * @param type
     * @returns
     */
    static filterTradelinesByType(tradelines: ITradeLinePartition[], type: string): ITradeLinePartition[] | [];
    /**
     * Sorts the tradeline by the account type
     * @param {ITradeLinePartition[]} tradeLines
     * @returns
     */
    static filterTradelinesByCreditReportGroups(tradeLines: ITradeLinePartition[], filters: CreditReportGroups[]): ITradeLinePartition[];
}
