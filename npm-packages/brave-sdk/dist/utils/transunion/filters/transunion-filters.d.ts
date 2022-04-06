import { CreditReportGroups } from '../../../constants/transunion';
import { TradeLinePartition } from '../../../models/merge-report';
export declare class TransunionFilters {
    constructor();
    /**
     * Filters by a set of provided pay statuses
     * @param tradelines
     * @param codes
     * @returns
     */
    static filterTradelinesByStatusCodes(tradelines: TradeLinePartition[], codes: Record<string, any>): TradeLinePartition[];
    /**
     * Filters by an industry code
     * @param tradelines
     * @param code
     * @returns
     */
    static filterTradelinesByIndustryCode(tradelines: TradeLinePartition[], code: string): TradeLinePartition[];
    /**
     * Filter by an account type symbol TradeLinePartition.accountTypeSymbol
     * @param tradelines
     * @param type
     * @returns
     */
    static filterTradelinesByType(tradelines: TradeLinePartition[], type: string): TradeLinePartition[] | [];
    /**
     * Sorts the tradeline by the account type
     * @param {TradeLinePartition[]} tradeLines
     * @returns
     */
    static filterTradelinesByCreditReportGroups(tradeLines: TradeLinePartition[], filters: CreditReportGroups[]): TradeLinePartition[];
}
