"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransunionReportQueries = void 0;
const transunion_missing_1 = require("../transunion-missing");
const conditions_1 = require("./conditions");
const common_tu_1 = require("../../_types/common-tu");
const transunion_1 = require("../../_constants/transunion");
class TransunionReportQueries extends transunion_missing_1.TransunionMissing {
    constructor() {
        super();
    }
    /*===================================*/
    //           MESSAGE
    /*===================================*/
    static isReportSupressed(report) {
        var _a, _b;
        if (!report)
            return false;
        let res = (_b = (_a = report.TrueLinkCreditReportType) === null || _a === void 0 ? void 0 : _a.Message) === null || _b === void 0 ? void 0 : _b.find((ele) => {
            var _a;
            ((_a = ele.Code) === null || _a === void 0 ? void 0 : _a.abbreviation) === 'Credit data suppressed';
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
    static listTradelines(report) {
        var _a;
        if (!report)
            return [];
        const partition = (_a = report.TrueLinkCreditReportType) === null || _a === void 0 ? void 0 : _a.TradeLinePartition;
        if (partition === undefined)
            return [];
        if (partition instanceof Array) {
            return partition;
        }
        else {
            return [partition];
        }
    }
    /**
     * Helper function to securely lookup the account type, falls back to pay status.
     * @param {ITradeLinePartition | undefined} partition
     * @returns
     */
    static getBraveTradelineDescription(partition) {
        var _a, _b, _c;
        if (!partition)
            return this.bcMissing;
        const description = partition.accountTypeDescription;
        const status = transunion_1.BRAVE_ACCOUNT_TYPE[`${(_b = (_a = partition.Tradeline) === null || _a === void 0 ? void 0 : _a.PayStatus) === null || _b === void 0 ? void 0 : _b.symbol}`];
        return ((_c = partition.accountTypeSymbol) === null || _c === void 0 ? void 0 : _c.toLowerCase()) === 'y' ? description || this.bcMissing : status;
    }
    /**
     * Helper function to securely lookup the account type, falls back to pay status.
     * @param {ITradeLinePartition | undefined} partition
     * @returns
     */
    static getTradelineTypeDescription(partition) {
        var _a;
        if (!partition)
            return common_tu_1.AccountTypes.Unknown;
        const description = common_tu_1.ACCOUNT_TYPES[`${(_a = partition.accountTypeSymbol) === null || _a === void 0 ? void 0 : _a.toLowerCase()}`];
        return description ? description : common_tu_1.AccountTypes.Unknown;
    }
    /**
     * Helper function to calculate the max delinquency.
     * @param {ITradeLinePartition | undefined} partition
     * @returns
     */
    static getDelinquencyCount(partition) {
        var _a, _b, _c, _d, _e, _f;
        if (!partition)
            return 0;
        const count30 = ((_b = (_a = partition.Tradeline) === null || _a === void 0 ? void 0 : _a.GrantedTrade) === null || _b === void 0 ? void 0 : _b.late30Count) || 0;
        const count60 = ((_d = (_c = partition.Tradeline) === null || _c === void 0 ? void 0 : _c.GrantedTrade) === null || _d === void 0 ? void 0 : _d.late60Count) || 0;
        const count90 = ((_f = (_e = partition.Tradeline) === null || _e === void 0 ? void 0 : _e.GrantedTrade) === null || _f === void 0 ? void 0 : _f.late90Count) || 0;
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
    static getOriginalCreditor(partition) {
        var _a, _b, _c, _d;
        if (!partition)
            return this.bcMissing;
        const originalCreditor = (_b = (_a = partition.Tradeline) === null || _a === void 0 ? void 0 : _a.CollectionTrade) === null || _b === void 0 ? void 0 : _b.originalCreditor;
        const creditorName = ((_c = partition.Tradeline) === null || _c === void 0 ? void 0 : _c.creditorName) || this.bcMissing;
        if (((_d = partition.accountTypeSymbol) === null || _d === void 0 ? void 0 : _d.toLowerCase()) === 'y') {
            return originalCreditor ? originalCreditor : creditorName;
        }
        else {
            return creditorName;
        }
    }
    /**
     * Helper function to securey look up the original creditor
     * @param {ITradeLinePartition | undefined} partition
     * @returns
     */
    static getCreditor(partition) {
        var _a;
        if (!partition)
            return this.bcMissing;
        return ((_a = partition.Tradeline) === null || _a === void 0 ? void 0 : _a.creditorName) || this.bcMissing;
    }
    /*=====================================*/
    //            SUBSCRIBER
    /*=====================================*/
    /**
     * Get the subscriber from the merge report by tradeline subscriber key
     * @param tradeline
     * @param subs
     * @returns
     */
    static getTradelineSubscriberByKey(tradeline, subs = []) {
        var _a;
        const code = (_a = tradeline === null || tradeline === void 0 ? void 0 : tradeline.Tradeline) === null || _a === void 0 ? void 0 : _a.subscriberCode;
        if (!code || !tradeline)
            return;
        return subs.find((sub) => {
            return sub.subscriberCode == code;
        });
    }
    /**
     * Get the subscriber from the merge report by publicItem subscriber key
     * @param publicItem
     * @param subs
     * @returns
     */
    static getPublicSubscriberByKey(publicItem, subs = []) {
        var _a;
        const code = (_a = publicItem === null || publicItem === void 0 ? void 0 : publicItem.PublicRecord) === null || _a === void 0 ? void 0 : _a.subscriberCode;
        if (!code || !publicItem)
            return;
        return subs.find((sub) => {
            return sub.subscriberCode == code;
        });
    }
    /*=====================================*/
    //            SUBSCRIBER
    /*=====================================*/
    /**
     * Get the subscriber from the merge report by tradeline subscriber key
     * @param tradeline
     * @param subs
     * @returns
     */
    static listSubscribers(report) {
        var _a;
        const subscribers = (_a = report.TrueLinkCreditReportType) === null || _a === void 0 ? void 0 : _a.Subscriber;
        if (subscribers instanceof Array)
            return subscribers;
        if (subscribers === undefined)
            return [];
        return [subscribers];
    }
    /*=====================================*/
    //            DISPUTE FLAG
    /*=====================================*/
    /**
     * Helper function to securely look up the dispute flag
     * @param {ITradeLinePartition | undefined} partition
     * @returns
     */
    static getDisputeFlag(partition) {
        var _a, _b;
        if (!partition)
            return 'No';
        const symbol = ((_b = (_a = partition.Tradeline) === null || _a === void 0 ? void 0 : _a.DisputeFlag) === null || _b === void 0 ? void 0 : _b.description) || 'not';
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
    static getAccountType(partition) {
        var _a, _b, _c;
        if (!partition)
            return 'unknown';
        const description = partition.accountTypeDescription;
        const status = transunion_1.BRAVE_ACCOUNT_TYPE[`${(_b = (_a = partition.Tradeline) === null || _a === void 0 ? void 0 : _a.PayStatus) === null || _b === void 0 ? void 0 : _b.symbol}`];
        return ((_c = partition.accountTypeSymbol) === null || _c === void 0 ? void 0 : _c.toLowerCase()) === 'y' ? description || 'No Data / Unknown' : status;
    }
    /**
     * Helper function to securely lookup the account type
     * @param {ITradeLinePartition | undefined} partition
     * @returns
     */
    static isForbearanceAccount(partition) {
        if (!partition)
            return false;
        const { accountTypeSymbol = '' } = partition;
        if (!accountTypeSymbol)
            return false;
        const accountType = transunion_1.FORBEARANCE_TYPE[accountTypeSymbol.toLowerCase()];
        if (!accountType)
            return false;
        if (accountTypeSymbol.toLowerCase() === 'm')
            return true; // simple mortgage
        const { Tradeline: { GrantedTrade: { AccountType: { symbol = '', description = '' } = {} } = {} } = {} } = partition;
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
    static isStudentLoanAccount(partition) {
        var _a, _b;
        if (!partition)
            return false;
        const industry = (_b = (_a = partition.Tradeline) === null || _a === void 0 ? void 0 : _a.IndustryCode) === null || _b === void 0 ? void 0 : _b.description;
        if (industry === null || industry === void 0 ? void 0 : industry.toLowerCase().includes('student')) {
            return true;
        }
        return false;
    }
    /**
     * Helper function to securely lookup the account type
     * @param {ITradeLinePartition | undefined} partition
     * @returns
     */
    static isNegativeAccount(partition) {
        var _a, _b;
        if (!partition)
            return false;
        const symbol = (_b = (_a = partition.Tradeline) === null || _a === void 0 ? void 0 : _a.PayStatus) === null || _b === void 0 ? void 0 : _b.symbol;
        if (!symbol)
            return false;
        return !!transunion_1.NEGATIVE_PAY_STATUS_CODES[`${symbol}`] || false;
    }
    /**
     * Helper function to securely lookup the account type
     * @param {ITradeLinePartition | undefined} partition
     * @returns
     */
    static isPositiveAccount(partition) {
        var _a, _b;
        if (!partition)
            return false;
        const symbol = (_b = (_a = partition.Tradeline) === null || _a === void 0 ? void 0 : _a.PayStatus) === null || _b === void 0 ? void 0 : _b.symbol;
        if (!symbol)
            return false;
        return !!transunion_1.POSITIVE_PAY_STATUS_CODES[`${symbol}`] || false;
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
    static isDataBreachCondition(report, condition) {
        var _a;
        if (!report)
            return transunion_1.DataBreaches.None;
        const borrower = (_a = report.TrueLinkCreditReportType) === null || _a === void 0 ? void 0 : _a.Borrower;
        const address = this.getCurrentAddress(borrower || {});
        const tradelines = this.listTradelines(report);
        const inquiries = this.listInquiries(report);
        switch (condition) {
            case transunion_1.DataBreaches.Condition1:
                // Check if living in California and have car loans
                return conditions_1.DataBreachConditions[transunion_1.DataBreaches.Condition1]({ address, tradelines });
                break;
            case transunion_1.DataBreaches.Condition2:
                // Check if living in California
                return conditions_1.DataBreachConditions[transunion_1.DataBreaches.Condition2]({ address });
                break;
            case transunion_1.DataBreaches.Condition3:
                // Check if living in Colorado
                return conditions_1.DataBreachConditions[transunion_1.DataBreaches.Condition3]({ address });
                break;
            case transunion_1.DataBreaches.Condition4:
                // Check if living in a Kroger state
                return conditions_1.DataBreachConditions[transunion_1.DataBreaches.Condition4]({ address, tradelines });
                break;
            case transunion_1.DataBreaches.Condition5:
                // Check for soft/hard inquiries with T Mobile
                return conditions_1.DataBreachConditions[transunion_1.DataBreaches.Condition5]({ inquiries });
                break;
            case transunion_1.DataBreaches.Condition6:
                // Check if living in Washington
                return conditions_1.DataBreachConditions[transunion_1.DataBreaches.Condition6]({ address });
                break;
            case transunion_1.DataBreaches.Condition7:
                // Check if living in Washington
                return conditions_1.DataBreachConditions[transunion_1.DataBreaches.Condition7]({ address });
                break;
            default:
                return transunion_1.DataBreaches.None;
                break;
        }
    }
    /**
     * Go through the data breaches identified and determine if the credit report matches any condtions
     * @param report
     * @returns
     */
    static listDataBreaches(report) {
        const breachCards = Object.values(transunion_1.DataBreaches)
            .filter((item) => {
            return this.isDataBreachCondition(report, item) !== transunion_1.DataBreaches.None;
        })
            .map((key) => {
            return transunion_1.DATA_BREACH_CARDS[key];
        });
        return breachCards;
    }
    /*=====================================*/
    //            Personal Info
    /*=====================================*/
    /**
     * Get the current borrower address
     * @param borrower
     * @returns
     */
    static getCurrentAddress(borrower) {
        const address = borrower === null || borrower === void 0 ? void 0 : borrower.BorrowerAddress;
        if (address === undefined)
            return;
        if (address instanceof Array) {
            return address.sort((a, b) => {
                return (a.addressOrder || 99) - (b.addressOrder || 99);
            })[0];
        }
        else {
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
    static listInquiries(report) {
        var _a;
        if (!report)
            return [];
        const inquiries = (_a = report.TrueLinkCreditReportType) === null || _a === void 0 ? void 0 : _a.InquiryPartition;
        if (inquiries === undefined)
            return [];
        if (inquiries instanceof Array) {
            return inquiries;
        }
        else {
            return [inquiries];
        }
    }
}
exports.TransunionReportQueries = TransunionReportQueries;
