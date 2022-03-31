"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreditDataBreachesMetric = void 0;
const transunion_1 = require("../../transunion/transunion");
const credit_report_metrics_1 = require("./credit-report-metrics");
class CreditDataBreachesMetric {
    constructor(report) {
        this.report = report;
    }
    getMetric() {
        const count = this.count();
        const status = this.status(count);
        return new credit_report_metrics_1.CreditReportMetric("databreaches" /* Databreaches */, "Data Breach & Leaks Tracker" /* Databreaches */, count, status);
    }
    count() {
        var _a;
        const tradelines = ((_a = this.report.TrueLinkCreditReportType) === null || _a === void 0 ? void 0 : _a.TradeLinePartition) || [];
        if (!tradelines || !tradelines.length)
            return 0;
        const breaches = transunion_1.TransunionUtil.queries.report.listDataBreaches(this.report);
        return breaches.length;
    }
    status(count) {
        return count ? 'danger' : 'safe';
    }
}
exports.CreditDataBreachesMetric = CreditDataBreachesMetric;
