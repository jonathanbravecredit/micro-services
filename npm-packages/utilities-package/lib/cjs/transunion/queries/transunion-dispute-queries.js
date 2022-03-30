"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransunionDisputeQueries = void 0;
const constants_1 = require("../constants");
const transunion_missing_1 = require("../transunion-missing");
class TransunionDisputeQueries extends transunion_missing_1.TransunionMissing {
    constructor() {
        super();
    }
    /*===================================*/
    //           SUBJECT RECORDS
    /*===================================*/
    static getLineItems(credit) {
        if (!credit)
            return [];
        const prodArr = credit === null || credit === void 0 ? void 0 : credit.productArray;
        const product = (prodArr instanceof Array ? prodArr[0] : prodArr === null || prodArr === void 0 ? void 0 : prodArr.product);
        const subjectRecord = product.subject.subjectRecord;
        const lineItems = subjectRecord.fileSummary.disclosureCoverInfo.summarySection.lineItem;
        return lineItems instanceof Array ? lineItems : [lineItems];
    }
    /*===================================*/
    //           PUBLIC RECORDS
    //  - INCLUDES ORIGINAL AND UPDATED
    /*===================================*/
    /**
     * uses the item key from the credit bureau findings and looks up the update partition in the merge report
     * @param cbKey
     * @param partition
     * @returns
     */
    static getUpdatedPublicRecordByKey(cbKey, partition) {
        const memberCode = cbKey.split('_').slice(0, 2)[1];
        if (!partition)
            return;
        return partition.find((item) => {
            var _a;
            const code = (_a = item.PublicRecord) === null || _a === void 0 ? void 0 : _a.subscriberCode;
            return code == memberCode;
        });
    }
    /**
     * uses the Tri Merge TrueLink report (as part of investigation results) and returns the public partitions array
     * @param report
     * @returns
     */
    static listUpdatedPublicRecords(report) {
        if (!report)
            return [];
        const partition = report.PulblicRecordPartition;
        if (partition instanceof Array) {
            return partition;
        }
        else {
            return partition ? [partition] : [];
        }
    }
    /**
     * List the subject record from the credit bureau file returned in dispute results
     * @param credit
     * @returns
     */
    static listPublicRecords(credit) {
        var _a, _b;
        if (!credit)
            return [];
        const prodArr = credit === null || credit === void 0 ? void 0 : credit.productArray;
        const product = (prodArr instanceof Array ? prodArr[0] : prodArr === null || prodArr === void 0 ? void 0 : prodArr.product);
        const subjectRecord = product.subject.subjectRecord;
        const publicRecord = (_b = (_a = subjectRecord === null || subjectRecord === void 0 ? void 0 : subjectRecord.custom) === null || _a === void 0 ? void 0 : _a.credit) === null || _b === void 0 ? void 0 : _b.publicRecord;
        if (publicRecord instanceof Array) {
            return publicRecord;
        }
        else {
            return publicRecord ? [publicRecord] : [];
        }
    }
    /*===================================*/
    //          TRADELINE RECORDS
    //  - INCLUDES ORIGINAL AND UPDATED
    /*===================================*/
    /**
     * uses the Tri Merge TrueLink report (as part of investigation results) and returns the tradeline partitions array
     * @param report
     * @returns
     */
    static listUpdatedTradelines(report) {
        if (!report)
            return [];
        const partition = report.TradeLinePartition;
        if (partition instanceof Array) {
            return partition;
        }
        else {
            return partition ? [partition] : [];
        }
    }
    /**
     * uses the item key from the credit bureau findings and looks up the update partition in the merge report
     * @param cbKey
     * @param partition
     * @returns
     */
    static getUpdatedTradelineByKey(cbKey, partition) {
        const memberCode = cbKey.split('_').slice(0, 2)[1];
        if (!partition)
            return;
        return partition.find((item) => {
            var _a;
            const code = (_a = item.Tradeline) === null || _a === void 0 ? void 0 : _a.subscriberCode;
            return code == memberCode;
        });
    }
    /*===================================*/
    //           TRADE RECORDS
    /*===================================*/
    /**
     * List the trades from the credit bureau file returned in dispute results
     * @param credit
     * @returns
     */
    static listTrades(credit) {
        var _a, _b, _c;
        if (!credit)
            return [];
        const prodArr = credit === null || credit === void 0 ? void 0 : credit.productArray;
        const product = (prodArr instanceof Array ? prodArr[0] : prodArr === null || prodArr === void 0 ? void 0 : prodArr.product);
        const subjectRecord = (_a = product === null || product === void 0 ? void 0 : product.subject) === null || _a === void 0 ? void 0 : _a.subjectRecord;
        const trade = (_c = (_b = subjectRecord === null || subjectRecord === void 0 ? void 0 : subjectRecord.custom) === null || _b === void 0 ? void 0 : _b.credit) === null || _c === void 0 ? void 0 : _c.trade;
        if (trade instanceof Array) {
            return trade;
        }
        else {
            return trade ? [trade] : [];
        }
    }
    /*===================================*/
    //           PERSONAL RECORDS
    /*===================================*/
    /**
     * List the results for personal dispute
     * @param credit
     * @returns
     */
    static listPersonalItems(credit) {
        var _a;
        if (!credit)
            return [];
        const prodArr = credit === null || credit === void 0 ? void 0 : credit.productArray;
        const product = (prodArr instanceof Array ? prodArr[0] : prodArr === null || prodArr === void 0 ? void 0 : prodArr.product);
        const subjectRecord = (_a = product === null || product === void 0 ? void 0 : product.subject) === null || _a === void 0 ? void 0 : _a.subjectRecord;
        const personal = subjectRecord === null || subjectRecord === void 0 ? void 0 : subjectRecord.fileSummary.disclosureCoverInfo.summarySection.lineItem; //.custom?.credit?.trade;
        if (personal instanceof Array) {
            return personal;
        }
        else {
            return personal ? [personal] : [];
        }
    }
    static isDisputeable(personal) {
        return personal.key !== 'curraddress' && personal.key !== 'name' && personal.key !== 'employer';
    }
    /*===================================*/
    //          FINDINGS RECORDS
    /*===================================*/
    /**
     * Helper function to securely look up the dispute flag
     * @param {ITradeLinePartition | undefined} partition
     * @returns
     */
    static getFindingByTrade(summarySection, trade) {
        if (!summarySection || !trade)
            return;
        const items = summarySection.lineItem;
        const lineItems = items instanceof Array ? items : [items];
        return lineItems.find((item) => {
            return item.itemKey === trade.itemKey;
        });
    }
    /**
     * List the subject record from the credit bureau file returned in dispute results
     * @param credit
     * @returns
     */
    static listFindings(credit) {
        var _a, _b, _c, _d;
        if (!credit)
            return [];
        const prodArr = credit === null || credit === void 0 ? void 0 : credit.productArray;
        const product = (prodArr instanceof Array ? prodArr[0] : prodArr === null || prodArr === void 0 ? void 0 : prodArr.product);
        const subjectRecord = (_a = product === null || product === void 0 ? void 0 : product.subject) === null || _a === void 0 ? void 0 : _a.subjectRecord;
        const lineItems = (_d = (_c = (_b = subjectRecord === null || subjectRecord === void 0 ? void 0 : subjectRecord.fileSummary) === null || _b === void 0 ? void 0 : _b.disclosureCoverInfo) === null || _c === void 0 ? void 0 : _c.summarySection) === null || _d === void 0 ? void 0 : _d.lineItem;
        if (lineItems instanceof Array) {
            return lineItems;
        }
        else {
            return lineItems ? [lineItems] : [];
        }
    }
    /**
     * Get the subject record from the credit bureau file returned in dispute results
     * @param credit
     * @returns
     */
    static listFindingsByType(credit, type) {
        var _a, _b, _c, _d;
        if (!credit)
            return [];
        const prodArr = credit === null || credit === void 0 ? void 0 : credit.productArray;
        const product = (prodArr instanceof Array ? prodArr[0] : prodArr === null || prodArr === void 0 ? void 0 : prodArr.product);
        const subjectRecord = (_a = product === null || product === void 0 ? void 0 : product.subject) === null || _a === void 0 ? void 0 : _a.subjectRecord;
        const findings = (_d = (_c = (_b = subjectRecord === null || subjectRecord === void 0 ? void 0 : subjectRecord.fileSummary) === null || _b === void 0 ? void 0 : _b.disclosureCoverInfo) === null || _c === void 0 ? void 0 : _c.summarySection) === null || _d === void 0 ? void 0 : _d.lineItem;
        let findingsArr = findings instanceof Array ? findings : findings ? [findings] : [];
        const filter = type === constants_1.CreditBureauFindingsType.PublicRecord ? 'pr' : 'tr';
        return findingsArr.filter((item) => {
            return item.handle.substring(0, 2).toLowerCase() == filter;
        });
    }
    /*===================================*/
    //          RESULT CODE
    /*===================================*/
    /**
     * Lookup the results of the investigation and return our codes
     * @param result
     * @returns
     */
    static getResultCode(result) {
        // check one...exact match
        const exactMatch = this.resultCodeMap.find((item) => {
            return item.title.toLowerCase() == result.toLowerCase();
        });
        if (exactMatch)
            return exactMatch.type;
        //check two..squishy match
        const parsedResult = result.split(' ');
        let match = '';
        let matchCount = 0;
        this.resultCodeMap.forEach((item) => {
            const parsedTitle = item.title.split(' ');
            let count = 0;
            parsedResult.forEach((word) => {
                const found = parsedTitle.find((t) => t.toLowerCase() == word.toLowerCase());
                if (found)
                    count++;
            });
            if (count > matchCount) {
                match = item.type;
                matchCount = count;
            }
        });
        return match;
    }
}
exports.TransunionDisputeQueries = TransunionDisputeQueries;
TransunionDisputeQueries.resultCodeMap = constants_1.INVESTIGATION_RESULTS_CODE_MAPPING;
