"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreditReportMetric = exports.CreditReportMetrics = void 0;
const credit_databreaches_metric_1 = require("./credit-databreaches-metric");
const credit_forbearance_metric_1 = require("./credit-forbearance-metric");
const credit_mix_metric_1 = require("./credit-mix-metric");
const credit_utilization_metric_1 = require("./credit-utilization-metric");
const credit_negative_accounts_metric_1 = require("./credit-negative-accounts-metric");
/**
 * Class to compile the 5 summary metrics from the MergeReport
 * @constructor MergeReport
 * @method calculateMetrics required to run and pull the metrics
 */
class CreditReportMetrics {
    constructor(report) {
        this.report = report;
        this.metrics = [];
    }
    /**
     *
     * @returns CreditReportMetric Array
     */
    calculateMetrics() {
        const metric1 = new credit_negative_accounts_metric_1.CreditNegativeAccountsMetric(this.report).getMetric();
        const metric2 = new credit_mix_metric_1.CreditMixMetric(this.report).getMetric();
        const metric3 = new credit_utilization_metric_1.CreditUtilizationMetric(this.report).getMetric();
        const metric4 = new credit_forbearance_metric_1.CreditForbearanceMetric(this.report).getMetric();
        const metric5 = new credit_databreaches_metric_1.CreditDataBreachesMetric(this.report).getMetric();
        this.metrics = [metric1, metric2, metric3, metric4, metric5];
        return this.metrics;
    }
}
exports.CreditReportMetrics = CreditReportMetrics;
class CreditReportMetric {
    constructor(metricId, metricLabel, metricValue, metricStatus) {
        this.metricId = metricId;
        this.metricLabel = metricLabel;
        this.metricValue = metricValue;
        this.metricStatus = metricStatus;
    }
}
exports.CreditReportMetric = CreditReportMetric;
