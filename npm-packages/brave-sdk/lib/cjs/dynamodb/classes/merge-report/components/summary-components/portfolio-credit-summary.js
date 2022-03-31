"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PortfolioCreditSummary = void 0;
const homogenize_data_1 = require("../../../homogenize/homogenize-data");
const portfolio_credit_summary_info_1 = require("./portfolio-credit-summary-info");
class PortfolioCreditSummary extends homogenize_data_1.Homogenize {
    constructor(_data) {
        super(_data);
        this.homogenize(_data);
        this.init();
    }
    init() {
        this.TransUnion = new portfolio_credit_summary_info_1.PortfolioCreditSummaryInfo(this.TransUnion);
    }
}
exports.PortfolioCreditSummary = PortfolioCreditSummary;
