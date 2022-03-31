"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Summary = void 0;
const homogenize_data_1 = require("../../../utils/homogenize/homogenize-data");
const account_history_summary_1 = require("./summary-components/account-history-summary");
const inquiry_summary_1 = require("./summary-components/inquiry-summary");
const portfolio_credit_summary_1 = require("./summary-components/portfolio-credit-summary");
const public_record_summary_1 = require("./summary-components/public-record-summary");
const tradeline_summary_1 = require("./summary-components/tradeline-summary");
class Summary extends homogenize_data_1.Homogenize {
    constructor(_data) {
        super(_data);
        this.PortfolioCreditSummary = [];
        this.AccountHistorySummary = [];
        this.homogenize(_data);
        this.init();
    }
    init() {
        this.TradelineSummary = new tradeline_summary_1.TradelineSummary(this.TradelineSummary);
        this.InquirySummary = new inquiry_summary_1.InquirySummary(this.InquirySummary);
        this.PublicRecordSummary = new public_record_summary_1.PublicRecordSummary(this.PublicRecordSummary);
        this.PortfolioCreditSummary = this.homogenizeArray(this.PortfolioCreditSummary, portfolio_credit_summary_1.PortfolioCreditSummary);
        this.AccountHistorySummary = this.homogenizeArray(this.AccountHistorySummary, account_history_summary_1.AccountHistorySummary);
    }
}
exports.Summary = Summary;
