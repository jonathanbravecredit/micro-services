"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountHistorySummary = void 0;
const homogenize_data_1 = require("../../../../utils/homogenize/homogenize-data");
const account_history_summaryInfo_1 = require("./account-history-summaryInfo");
class AccountHistorySummary extends homogenize_data_1.Homogenize {
    constructor(_data) {
        super(_data);
        this.homogenize(_data);
        this.init();
    }
    init() {
        this.TransUnion = new account_history_summaryInfo_1.AccountHistorySummaryInfo(this.TransUnion);
    }
}
exports.AccountHistorySummary = AccountHistorySummary;
