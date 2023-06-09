import { IBreachCard } from '../../../types/breach-card';
import { TransunionMissing } from '../transunion-missing';
import { DataBreaches, AccountTypes } from '../../../constants/transunion';
import { IBorrower, IBorrowerAddress, IInquiryPartition, IMergeReport, IPublicPartition, ISubscriber, ITradeLinePartition } from '../../../types/merge-report';
export declare class TransunionReportQueries extends TransunionMissing {
    constructor();
    static isReportSupressed(report: IMergeReport | null): boolean;
    /**
     * Helper function to securely lookup the account type, falls back to pay status.
     * @param {ITradeLinePartition | undefined} partition
     * @returns
     */
    static listTradelines(report: IMergeReport | null): ITradeLinePartition[] | [];
    /**
     * Helper function to securely lookup the account type, falls back to pay status.
     * @param {ITradeLinePartition | undefined} partition
     * @returns
     */
    static getBraveTradelineDescription(partition: ITradeLinePartition | undefined): string;
    /**
     * Helper function to securely lookup the account type, falls back to pay status.
     * @param {ITradeLinePartition | undefined} partition
     * @returns
     */
    static getTradelineTypeDescription(partition: ITradeLinePartition | undefined): AccountTypes;
    /**
     * Helper function to calculate the max delinquency.
     * @param {ITradeLinePartition | undefined} partition
     * @returns
     */
    static getDelinquencyCount(partition: ITradeLinePartition | undefined): number;
    /**
     * Helper function to securey look up the original creditor
     * @param {ITradeLinePartition | undefined} partition
     * @returns
     */
    static getOriginalCreditor(partition: ITradeLinePartition | undefined | null): string;
    /**
     * Helper function to securey look up the original creditor
     * @param {ITradeLinePartition | undefined} partition
     * @returns
     */
    static getCreditor(partition: ITradeLinePartition | undefined | null): string;
    /**
     * Get the ISubscriber from the merge report by tradeline ISubscriber key
     * @param tradeline
     * @param subs
     * @returns
     */
    static getTradelineISubscriberByKey(tradeline: ITradeLinePartition | undefined, subs?: ISubscriber[]): ISubscriber | undefined;
    /**
     * Get the ISubscriber from the merge report by publicItem ISubscriber key
     * @param publicItem
     * @param subs
     * @returns
     */
    static getPublicISubscriberByKey(publicItem: IPublicPartition | undefined, subs?: ISubscriber[]): ISubscriber | undefined;
    /**
     * Get the ISubscriber from the merge report by tradeline ISubscriber key
     * @param tradeline
     * @param subs
     * @returns
     */
    static listISubscribers(report: IMergeReport): ISubscriber[] | [];
    /**
     * Helper function to securely look up the dispute flag
     * @param {ITradeLinePartition | undefined} partition
     * @returns
     */
    static getDisputeFlag(partition: ITradeLinePartition | undefined): string;
    /**
     * Helper function to securely lookup the account type
     * @param {ITradeLinePartition | undefined} partition
     * @returns
     */
    static getAccountType(partition: ITradeLinePartition | undefined): string;
    /**
     * Helper function to securely lookup the account type
     * @param {ITradeLinePartition | undefined} partition
     * @returns
     */
    static isForbearanceAccount(partition: ITradeLinePartition | undefined): boolean;
    /**
     * Helper function to check if the tradeline is a student loan account
     * @param partition
     * @returns
     */
    static isStudentLoanAccount(partition: ITradeLinePartition | undefined): boolean;
    /**
     * Helper function to securely lookup the account type
     * @param {ITradeLinePartition | undefined} partition
     * @returns
     */
    static isNegativeAccount(partition: ITradeLinePartition | undefined): boolean;
    /**
     * Helper function to securely lookup the account type
     * @param {ITradeLinePartition | undefined} partition
     * @returns
     */
    static isPositiveAccount(partition: ITradeLinePartition | undefined): boolean;
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
    static isDataBreachCondition(report: IMergeReport, condition: string): DataBreaches;
    /**
     * Go through the data breaches identified and determine if the credit report matches any condtions
     * @param report
     * @returns
     */
    static listDataBreaches(report: IMergeReport): IBreachCard[];
    /**
     * Get the current IBorrower address
     * @param IBorrower
     * @returns
     */
    static getCurrentAddress(IBorrower: IBorrower): IBorrowerAddress | undefined;
    /**
     * Helper function to consistently pull inquiry partitions
     * @param report
     * @returns
     */
    static listInquiries(report: IMergeReport): IInquiryPartition[] | [];
}
