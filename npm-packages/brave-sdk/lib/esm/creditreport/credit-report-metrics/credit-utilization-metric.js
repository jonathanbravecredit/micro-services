import { CreditReportMetric } from './credit-report-metrics';
export class CreditUtilizationMetric {
    constructor(report) {
        var _a;
        this.report = report;
        this.tradelines = [];
        this.tradelines = ((_a = report.TrueLinkCreditReportType) === null || _a === void 0 ? void 0 : _a.TradeLinePartition) || [];
    }
    getMetric() {
        const perc = this.calculateCreditUtilization(this.tradelines);
        const status = this.mapUtilizationStatusToSnapshot(this.calculateCreditStatus(perc));
        return new CreditReportMetric("credit_utilization" /* CreditUtilization */, "Credit Utilization" /* CreditUtilization */, perc, status);
    }
    getCreditUtilizationSnapshotStatus(tradelines) {
        const perc = this.calculateCreditUtilization(tradelines);
        const status = this.mapUtilizationStatusToSnapshot(this.calculateCreditStatus(perc));
        return {
            status,
            perc,
        };
    }
    calculateCreditUtilization(tradelines) {
        const debtAmount = this.sumDebtAmount(tradelines);
        const totalAmount = this.sumTotalAmount(tradelines);
        const utilizationPerc = this.calcUtilzationPerc(debtAmount, totalAmount);
        return utilizationPerc;
    }
    sumDebtAmount(tradelines) {
        return tradelines.reduce((a, partition) => {
            var _a, _b, _c, _d, _e, _f;
            const openClosed = ((_c = (_b = (_a = partition.Tradeline) === null || _a === void 0 ? void 0 : _a.OpenClosed) === null || _b === void 0 ? void 0 : _b.symbol) === null || _c === void 0 ? void 0 : _c.toString().toLowerCase()) || '';
            const typeSymbol = ((_d = partition.accountTypeSymbol) === null || _d === void 0 ? void 0 : _d.toLowerCase()) || '';
            const limit = +(((_f = (_e = partition.Tradeline) === null || _e === void 0 ? void 0 : _e.GrantedTrade) === null || _f === void 0 ? void 0 : _f.CreditLimit) || 0);
            const currBal = +(partition.Tradeline.currentBalance || 0);
            const open = openClosed === 'o';
            if (!open)
                return a;
            if (typeSymbol !== 'r')
                return a;
            if (limit <= 0)
                return a;
            return a + +currBal;
        }, 0);
    }
    sumTotalAmount(tradelines) {
        return tradelines.reduce((a, partition) => {
            var _a, _b, _c, _d, _e, _f;
            const openClosed = ((_c = (_b = (_a = partition.Tradeline) === null || _a === void 0 ? void 0 : _a.OpenClosed) === null || _b === void 0 ? void 0 : _b.symbol) === null || _c === void 0 ? void 0 : _c.toString().toLowerCase()) || '';
            const typeSymbol = ((_d = partition.accountTypeSymbol) === null || _d === void 0 ? void 0 : _d.toLowerCase()) || '';
            const limit = +(((_f = (_e = partition.Tradeline) === null || _e === void 0 ? void 0 : _e.GrantedTrade) === null || _f === void 0 ? void 0 : _f.CreditLimit) || 0);
            const open = openClosed === 'o';
            if (!open)
                return a;
            if (typeSymbol !== 'r')
                return a;
            return a + limit;
        }, 0);
    }
    calcUtilzationPerc(debt, total) {
        if (total === 0)
            return 0;
        return Math.floor((debt / total) * 100);
    }
    calculateCreditStatus(percetangeUtilization) {
        if (percetangeUtilization === undefined)
            return 'closed';
        if (percetangeUtilization === '<1')
            return 'excellent';
        switch (true) {
            case percetangeUtilization <= 9:
                return 'excellent';
            case percetangeUtilization <= 29:
                return 'good';
            case percetangeUtilization <= 49:
                return 'fair';
            case percetangeUtilization <= 74:
                return 'poor';
            default:
                return 'verypoor';
        }
    }
    mapUtilizationStatusToSnapshot(status) {
        const mapper = {
            verypoor: 'critical',
            poor: 'semicritical',
            fair: 'danger',
            good: 'normal',
            excellent: 'safe',
        };
        return mapper[status.toLowerCase()];
    }
}
