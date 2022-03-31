import { CreditDataBreachesMetric } from './credit-databreaches-metric';
import { CreditForbearanceMetric } from './credit-forbearance-metric';
import { CreditMixMetric } from './credit-mix-metric';
import { CreditUtilizationMetric } from './credit-utilization-metric';
import { NegativeAccountsMetric } from './negative-accounts-metric';
export class CreditReportMetrics {
    constructor(report) {
        this.report = report;
        this.metrics = [];
    }
    calculateMetrics() {
        const metric1 = new NegativeAccountsMetric(this.report).getMetric();
        const metric2 = new CreditMixMetric(this.report).getMetric();
        const metric3 = new CreditUtilizationMetric(this.report).getMetric();
        const metric4 = new CreditForbearanceMetric(this.report).getMetric();
        const metric5 = new CreditDataBreachesMetric(this.report).getMetric();
        this.metrics = [metric1, metric2, metric3, metric4, metric5];
        return this.metrics;
    }
}
export class CreditReportMetric {
    constructor(metricId, metricLabel, metricValue, metricStatus) {
        this.metricId = metricId;
        this.metricLabel = metricLabel;
        this.metricValue = metricValue;
        this.metricStatus = metricStatus;
    }
}
