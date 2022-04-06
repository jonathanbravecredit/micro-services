"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TradelineSummaryInfo = void 0;
const homogenize_data_1 = require("../../../../utils/homogenize/homogenize-data");
const code_ref_1 = require("../../common/code-ref");
class TradelineSummaryInfo extends homogenize_data_1.Homogenize {
    constructor(_data) {
        super(_data);
        this.TotalHistoricalNegatives = null;
        this.OpenCollectionAccounts = null;
        this.TotalCollectionAccounts = null;
        this.HistoricalNegativeAccounts = null;
        this.TotalInstallmentAccounts = null;
        this.OpenInstallmentAccounts = null;
        this.TotalOtherAccounts = null;
        this.OpenOtherAccounts = null;
        this.OpenMortgageAccounts = null;
        this.RecentDeliquencyDate = null;
        this.TotalMortgageAccounts = null;
        this.DelinquentAccounts = null;
        this.DerogatoryAccounts = null;
        this.CloseAccounts = null;
        this.TotalAccounts = null;
        this.OpenAccounts = null;
        this.TotalRevolvingAccounts = null;
        this.OpenRevolvingAccounts = null;
        this.CreditSummaryPeriod = null;
        this.TotalBalances = null;
        this.TotalMonthlyPayments = null;
        this.AgeofCredit = null;
        this.homogenize(_data);
        this.init();
    }
    init() {
        this.RecentDeliquencyMOP = new code_ref_1.CodeRef(this.RecentDeliquencyMOP);
    }
}
exports.TradelineSummaryInfo = TradelineSummaryInfo;
