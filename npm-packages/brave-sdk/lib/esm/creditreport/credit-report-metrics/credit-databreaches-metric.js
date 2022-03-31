import { TransunionUtil as tu } from '../../transunion/transunion';
import { CreditReportMetric } from './credit-report-metrics';
export class CreditDataBreachesMetric {
    constructor(report) {
        this.report = report;
    }
    getMetric() {
        const count = this.count();
        const status = this.status(count);
        return new CreditReportMetric("databreaches" /* Databreaches */, "Data Breach & Leaks Tracker" /* Databreaches */, count, status);
    }
    count() {
        var _a;
        const tradelines = ((_a = this.report.TrueLinkCreditReportType) === null || _a === void 0 ? void 0 : _a.TradeLinePartition) || [];
        if (!tradelines || !tradelines.length)
            return 0;
        const breaches = tu.queries.report.listDataBreaches(this.report);
        return breaches.length;
    }
    status(count) {
        return count ? 'danger' : 'safe';
    }
}
