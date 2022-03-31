"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountHistorySummaryInfo = void 0;
const homogenize_data_1 = require("../../../homogenize/homogenize-data");
const code_ref_1 = require("../../common/code-ref");
class AccountHistorySummaryInfo extends homogenize_data_1.Homogenize {
    constructor(_data) {
        super(_data);
        this.TotalPaymentRatio = null;
        this.ActualPaymentAmount = null;
        this.PaymentDueAmount = null;
        this.TransactorRevolverIndicator = null;
        this.EndingBalanceAmount = null;
        this.AggregateExcessPaymentAmount = null;
        this.ActiveAccounts = null;
        this.OpenAccounts = null;
        this.TimePeriod = null;
        this.EstimatedSpendAmount = null;
        this.PriorMonthBalance = null;
        this.CreditLimitAmount = null;
        this.homogenize(_data);
        this.init();
    }
    init() {
        this.SummaryType = new code_ref_1.CodeRef(this.SummaryType);
    }
}
exports.AccountHistorySummaryInfo = AccountHistorySummaryInfo;
