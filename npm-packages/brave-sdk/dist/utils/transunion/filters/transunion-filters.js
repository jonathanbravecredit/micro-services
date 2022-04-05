"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransunionFilters = void 0;
const transunion_1 = require("../../../constants/transunion");
class TransunionFilters {
    constructor() { }
    /**
     * Filters by a set of provided pay statuses
     * @param tradelines
     * @param codes
     * @returns
     */
    static filterTradelinesByStatusCodes(tradelines, codes) {
        return tradelines.filter((item) => {
            var _a, _b;
            let status = codes[`${(_b = (_a = item.Tradeline) === null || _a === void 0 ? void 0 : _a.PayStatus) === null || _b === void 0 ? void 0 : _b.symbol}`];
            return !!status;
        });
    }
    /**
     * Filters by an industry code
     * @param tradelines
     * @param code
     * @returns
     */
    static filterTradelinesByIndustryCode(tradelines, code) {
        return tradelines.filter((item) => {
            var _a, _b;
            let result = `${((_b = (_a = item === null || item === void 0 ? void 0 : item.Tradeline) === null || _a === void 0 ? void 0 : _a.IndustryCode) === null || _b === void 0 ? void 0 : _b.symbol) || ''}`.toLowerCase() === code.toLowerCase();
            return result;
        });
    }
    /**
     * Filter by an account type symbol TradeLinePartition.accountTypeSymbol
     * @param tradelines
     * @param type
     * @returns
     */
    static filterTradelinesByType(tradelines, type) {
        return tradelines.filter((item) => {
            let result = `${(item === null || item === void 0 ? void 0 : item.accountTypeSymbol) || ''}`.toLowerCase() === type;
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
    static filterTradelinesByCreditReportGroups(tradeLines, filters) {
        const _filters = {};
        filters.forEach((item) => (_filters[`${item}`] = true));
        const results = tradeLines.filter((item) => {
            var _a;
            const symbol = (_a = item.accountTypeSymbol) === null || _a === void 0 ? void 0 : _a.toLowerCase();
            const group = transunion_1.CREDIT_REPORT_GROUPS[symbol || ''];
            if (!symbol || !group)
                return 0;
            return _filters[group.group];
        });
        return results;
    }
}
exports.TransunionFilters = TransunionFilters;
