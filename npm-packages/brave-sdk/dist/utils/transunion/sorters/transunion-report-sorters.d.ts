import { TradeLinePartition } from '../../../models/merge-report';
export declare class TransunionReportSorters {
    constructor();
    /**
     * Sorts the tradeline by the account type
     * @param {TradeLinePartition[]} tradeLines
     * @returns
     */
    static sortTradelineByAccountType(tradeLines: TradeLinePartition[]): TradeLinePartition[];
    /**
     * Sorts the tradeline by the account type
     * @param {TradeLinePartition[]} tradeLines
     * @returns
     */
    static sortByCreditReportGroups(tradeLines: TradeLinePartition[]): TradeLinePartition[];
    /**
     * Sorts the tradeline by the date opened keeping the sort by account type
     * @param {TradeLinePartition[]} tradeLines
     * @returns
     */
    static sortTradelineByDateOpened(tradeLines: TradeLinePartition[]): TradeLinePartition[];
    /**
     * Sorts the tradeline by the account type (negative first by default)
     * @param tradeLines
     * @param positive optional flag to switch the order to positive first
     * @returns
     */
    static sortTradelineByPayStatus(tradeLines: TradeLinePartition[], positive?: boolean): TradeLinePartition[];
}
