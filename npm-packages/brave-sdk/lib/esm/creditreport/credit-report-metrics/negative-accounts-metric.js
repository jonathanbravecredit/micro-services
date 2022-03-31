import { TransunionUtil as tu } from '../../transunion/transunion';
import { CreditReportMetric } from './credit-report-metrics';
export class NegativeAccountsMetric {
    constructor(report) {
        this.report = report;
    }
    getMetric() {
        const count = this.count();
        const status = this.status(count);
        return new CreditReportMetric("negative_accounts" /* NegativeAccounts */, "Negative Accounts" /* NegativeAccounts */, count, status);
    }
    count() {
        var _a;
        const tradelines = ((_a = this.report.TrueLinkCreditReportType) === null || _a === void 0 ? void 0 : _a.TradeLinePartition) || [];
        if (!tradelines || !tradelines.length)
            return 0;
        return tradelines.filter(tu.queries.report.isNegativeAccount).length || 0;
    }
    status(count) {
        return count ? 'critical' : 'safe';
    }
}
