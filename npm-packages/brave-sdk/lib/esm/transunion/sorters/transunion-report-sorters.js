import { CREDIT_REPORT_GROUPS, POSITIVE_PAY_STATUS_CODES } from '../../_constants/transunion';
export class TransunionReportSorters {
    constructor() { }
    /*=====================================*/
    //            ACCOUNT TYPE
    /*=====================================*/
    /**
     * Sorts the tradeline by the account type
     * @param {ITradeLinePartition[]} tradeLines
     * @returns
     */
    static sortTradelineByAccountType(tradeLines) {
        return [
            ...tradeLines.sort((a, b) => {
                var _a, _b, _c, _d;
                if (((_a = a.accountTypeSymbol) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === 'y' && ((_b = b.accountTypeDescription) === null || _b === void 0 ? void 0 : _b.toLowerCase()) !== 'y') {
                    return 1;
                }
                if (((_c = a.accountTypeSymbol) === null || _c === void 0 ? void 0 : _c.toLowerCase()) !== 'y' && ((_d = b.accountTypeDescription) === null || _d === void 0 ? void 0 : _d.toLowerCase()) === 'y') {
                    return -1;
                }
                return 0;
            }),
        ];
    }
    /*=====================================*/
    //         CREDIT REPORT GROUPS
    /*=====================================*/
    /**
     * Sorts the tradeline by the account type
     * @param {ITradeLinePartition[]} tradeLines
     * @returns
     */
    static sortByCreditReportGroups(tradeLines) {
        return tradeLines.sort((a, b) => {
            var _a, _b;
            const symA = (_a = a.accountTypeSymbol) === null || _a === void 0 ? void 0 : _a.toLowerCase();
            const symB = (_b = b.accountTypeSymbol) === null || _b === void 0 ? void 0 : _b.toLowerCase();
            if (!symA || !symB)
                return 0;
            return CREDIT_REPORT_GROUPS[symA]['order'] - CREDIT_REPORT_GROUPS[symB]['order'];
        });
    }
    /*=====================================*/
    //            DATE OPENED
    /*=====================================*/
    /**
     * Sorts the tradeline by the date opened keeping the sort by account type
     * @param {ITradeLinePartition[]} tradeLines
     * @returns
     */
    static sortTradelineByDateOpened(tradeLines) {
        return [
            ...tradeLines.sort((a, b) => {
                var _a, _b, _c, _d;
                if (a.accountTypeSymbol !== b.accountTypeSymbol) {
                    return 0;
                }
                if (((_a = a.Tradeline) === null || _a === void 0 ? void 0 : _a.dateOpened) < ((_b = b.Tradeline) === null || _b === void 0 ? void 0 : _b.dateOpened)) {
                    return 1;
                }
                if (((_c = a.Tradeline) === null || _c === void 0 ? void 0 : _c.dateOpened) > ((_d = b.Tradeline) === null || _d === void 0 ? void 0 : _d.dateOpened)) {
                    return -1;
                }
                return 0;
            }),
        ];
    }
    /*=====================================*/
    //            PAY STATUS
    /*=====================================*/
    /**
     * Sorts the tradeline by the account type (negative first by default)
     * @param tradeLines
     * @param positive optional flag to switch the order to positive first
     * @returns
     */
    static sortTradelineByPayStatus(tradeLines, positive = false) {
        const sort = positive ? 1 : -1;
        return [
            ...tradeLines.sort((a, b) => {
                var _a, _b, _c, _d;
                const statusA = POSITIVE_PAY_STATUS_CODES[`${(_b = (_a = a.Tradeline) === null || _a === void 0 ? void 0 : _a.PayStatus) === null || _b === void 0 ? void 0 : _b.symbol}`] ? -1 * sort : 1 * sort;
                const statusB = POSITIVE_PAY_STATUS_CODES[`${(_d = (_c = b.Tradeline) === null || _c === void 0 ? void 0 : _c.PayStatus) === null || _d === void 0 ? void 0 : _d.symbol}`] ? -1 * sort : 1 * sort;
                return statusA - statusB;
            }),
        ];
    }
}
