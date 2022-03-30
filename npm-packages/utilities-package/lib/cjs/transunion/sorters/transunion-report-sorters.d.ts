import { ITradeLinePartition } from '../interfaces/merge-report.interface';
import { TransunionMissing } from '../transunion-missing';
export declare class TransunionReportSorters extends TransunionMissing {
    constructor();
    /**
     * Sorts the tradeline by the account type
     * @param {ITradeLinePartition[]} tradeLines
     * @returns
     */
    static sortTradelineByAccountType(tradeLines: ITradeLinePartition[]): ITradeLinePartition[];
    /**
     * Sorts the tradeline by the account type
     * @param {ITradeLinePartition[]} tradeLines
     * @returns
     */
    static sortByCreditReportGroups(tradeLines: ITradeLinePartition[]): ITradeLinePartition[];
    /**
     * Sorts the tradeline by the date opened keeping the sort by account type
     * @param {ITradeLinePartition[]} tradeLines
     * @returns
     */
    static sortTradelineByDateOpened(tradeLines: ITradeLinePartition[]): ITradeLinePartition[];
    /**
     * Sorts the tradeline by the account type (negative first by default)
     * @param tradeLines
     * @param positive optional flag to switch the order to positive first
     * @returns
     */
    static sortTradelineByPayStatus(tradeLines: ITradeLinePartition[], positive?: boolean): ITradeLinePartition[];
}
