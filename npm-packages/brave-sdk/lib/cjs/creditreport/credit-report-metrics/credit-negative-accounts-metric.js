"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreditNegativeAccountsMetric = void 0;
const transunion_1 = require("../../transunion/transunion");
const credit_report_metrics_1 = require("./credit-report-metrics");
class CreditNegativeAccountsMetric {
    constructor(report) {
        this.report = report;
    }
    getMetric() {
        const count = this.count();
        const status = this.status(count);
        return new credit_report_metrics_1.CreditReportMetric("negative_accounts" /* NegativeAccounts */, "Negative Accounts" /* NegativeAccounts */, count, status);
    }
    count() {
        var _a;
        const tradelines = ((_a = this.report.TrueLinkCreditReportType) === null || _a === void 0 ? void 0 : _a.TradeLinePartition) || [];
        if (!tradelines || !tradelines.length)
            return 0;
        return tradelines.filter(transunion_1.TransunionUtil.queries.report.isNegativeAccount).length || 0;
    }
    status(count) {
        return count ? 'critical' : 'safe';
    }
}
exports.CreditNegativeAccountsMetric = CreditNegativeAccountsMetric;
