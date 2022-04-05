import { CreditBureauFindingsType } from '../../../constants/transunion';
import { ICreditBureau, ILineItem, ITrade, ISummarySection, IPublicRecord } from '../../../types/credit-bureau';
import { IPublicPartition, ITradeLinePartition, ITrueLinkCreditReportType } from '../../../types/merge-report';
export declare class TransunionDisputeQueries {
    static resultCodeMap: {
        type: string;
        title: string;
    }[];
    constructor();
    static getLineItems(credit: ICreditBureau): ILineItem[];
    /**
     * uses the item key from the credit bureau findings and looks up the update partition in the merge report
     * @param cbKey
     * @param partition
     * @returns
     */
    static getUpdatedPublicRecordByKey(cbKey: string, partition: IPublicPartition[]): IPublicPartition | undefined;
    /**
     * uses the Tri Merge TrueLink report (as part of investigation results) and returns the public partitions array
     * @param report
     * @returns
     */
    static listUpdatedPublicRecords(report: ITrueLinkCreditReportType): IPublicPartition[] | [];
    /**
     * List the subject record from the credit bureau file returned in dispute results
     * @param credit
     * @returns
     */
    static listPublicRecords(credit: ICreditBureau | undefined): IPublicRecord[] | [];
    /**
     * uses the Tri Merge TrueLink report (as part of investigation results) and returns the tradeline partitions array
     * @param report
     * @returns
     */
    static listUpdatedTradelines(report: ITrueLinkCreditReportType): ITradeLinePartition[] | [];
    /**
     * uses the item key from the credit bureau findings and looks up the update partition in the merge report
     * @param cbKey
     * @param partition
     * @returns
     */
    static getUpdatedTradelineByKey(cbKey: string, partition: ITradeLinePartition[]): ITradeLinePartition | undefined;
    /**
     * List the trades from the credit bureau file returned in dispute results
     * @param credit
     * @returns
     */
    static listTrades(credit: ICreditBureau | undefined): ITrade[] | [];
    /**
     * List the results for personal dispute
     * @param credit
     * @returns
     */
    static listPersonalItems(credit: ICreditBureau | undefined): ILineItem[] | [];
    static isDisputeable(personal: {
        key: 'curraddress' | 'name' | 'employer' | unknown;
    }): boolean;
    /**
     * Helper function to securely look up the dispute flag
     * @param {TradeLinePartition | undefined} partition
     * @returns
     */
    static getFindingByTrade(summarySection: ISummarySection, trade: ITrade): ILineItem | undefined;
    /**
     * List the subject record from the credit bureau file returned in dispute results
     * @param credit
     * @returns
     */
    static listFindings(credit: ICreditBureau | undefined): ILineItem[] | [];
    /**
     * Get the subject record from the credit bureau file returned in dispute results
     * @param credit
     * @returns
     */
    static listFindingsByType(credit: ICreditBureau | undefined, type: CreditBureauFindingsType): ILineItem[] | [];
    /**
     * Lookup the results of the investigation and return our codes
     * @param result
     * @returns
     */
    static getResultCode(result: string): string;
}
