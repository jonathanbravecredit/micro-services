"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PortfolioCreditSummaryInfo = void 0;
const homogenize_data_1 = require("../../../homogenize/homogenize-data");
const code_ref_1 = require("../../common/code-ref");
class PortfolioCreditSummaryInfo extends homogenize_data_1.Homogenize {
    constructor(_data) {
        super(_data);
        this.CurrentPaymentDueAmount = null;
        this.PriorPaymentDueAmount = null;
        this.CurrentActualPaymentAmount = null;
        this.PastDueAmount = null;
        this.CreditLimitAmount = null;
        this.BalanceAmount = null;
        this.homogenize(_data);
        this.init();
    }
    init() {
        this.SummaryType = new code_ref_1.CodeRef(this.SummaryType);
    }
}
exports.PortfolioCreditSummaryInfo = PortfolioCreditSummaryInfo;
