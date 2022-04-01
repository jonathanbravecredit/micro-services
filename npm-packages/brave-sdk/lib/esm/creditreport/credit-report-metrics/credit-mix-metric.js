import { CreditMixRecommendations, RecommendationConditionalLogic, RecommendationValues, } from '../../_constants/transunion';
import { CreditReportMetric } from './credit-report-metrics';
export class CreditMixMetric {
    constructor(report) {
        this.report = report;
        this._summary = new CreditMixMetricSummaryMaker();
        this.init(report.TrueLinkCreditReportType.TradeLinePartition || []);
    }
    getMetric() {
        const { rating = '' } = this.getRatingsOnly() || {};
        const status = this.mapCreditMixSnapshotStatus(rating);
        return new CreditReportMetric("credit_mix" /* CreditMix */, "Credit Mix" /* CreditMix */, rating, status);
    }
    get summary() {
        return this._summary;
    }
    init(partitions) {
        partitions.forEach((tradeline) => {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            const openClosed = ((_c = (_b = (_a = tradeline.Tradeline) === null || _a === void 0 ? void 0 : _a.OpenClosed) === null || _b === void 0 ? void 0 : _b.symbol) === null || _c === void 0 ? void 0 : _c.toString().toLowerCase()) || '';
            const typeSymbol = ((_d = tradeline.accountTypeSymbol) === null || _d === void 0 ? void 0 : _d.toLowerCase()) || '';
            const tradeSymbol = ((_h = (_g = (_f = (_e = tradeline.Tradeline) === null || _e === void 0 ? void 0 : _e.GrantedTrade) === null || _f === void 0 ? void 0 : _f.AccountType) === null || _g === void 0 ? void 0 : _g.symbol) === null || _h === void 0 ? void 0 : _h.toString().toLowerCase()) || '';
            const open = openClosed === 'o';
            this.condition1(open);
            this.condition2(open, typeSymbol);
            this.condition3(open, tradeSymbol);
        });
    }
    condition1(open) {
        if (!open)
            this.summary.amountOfClosed += 1;
        this.summary.totalLineAmount += 1;
    }
    condition2(open, type) {
        if (type === 'r')
            this.flagCreditCards(open);
        if (type === 'm')
            this.flagMortgages(open);
    }
    condition3(open, type) {
        if (type === 'st' || type === 'educ')
            this.flagStudentLoans(open);
        else if (type === 'al' || type === 'ar' || type === 'at' || type === 'au')
            this.flagAutoLoans(open);
    }
    flagCreditCards(open) {
        if (open)
            this.flagOpenCreditCards();
        this.summary.hasCreditCards = true;
        this.summary.creditCardAmount += 1;
    }
    flagOpenCreditCards() {
        this.summary.hasOpenCreditCards = true;
        this.summary.amountOfOpenCreditCards += 1;
    }
    flagMortgages(open) {
        if (open)
            this.flagOpenMortgages();
        this.summary.hasMortgages = true;
        this.summary.mortgageAmount += 1;
    }
    flagOpenMortgages() {
        this.summary.hasOpenMortgages = true;
    }
    flagStudentLoans(open) {
        if (open)
            this.flagOpenStudentLoans();
        this.summary.hasStudentLoans = true;
        this.summary.studentLoanAmount += 1;
    }
    flagOpenStudentLoans() {
        this.summary.hasOpenStudentLoans = true;
    }
    flagAutoLoans(open) {
        if (open)
            this.flagOpenAutoLoans();
        this.summary.hasAutoLoans = true;
        this.summary.autoLoanAmount += 1;
    }
    flagOpenAutoLoans() {
        this.summary.hasOpenAutoLoans = true;
    }
    getRatingsOnly() {
        const recs = Object.values(CreditMixRecommendations);
        for (let i = 0; i < recs.length; i++) {
            if (RecommendationConditionalLogic[recs[i]](this.summary)) {
                const { rating, color } = RecommendationValues[recs[i]];
                return {
                    rating,
                    color,
                };
            }
        }
    }
    getRecommendations() {
        const recs = Object.values(CreditMixRecommendations);
        for (let i = 0; i < recs.length; i++) {
            if (RecommendationConditionalLogic[recs[i]](this.summary)) {
                return RecommendationValues[recs[i]];
            }
        }
    }
    mapCreditMixSnapshotStatus(status) {
        const mapper = {
            poor: 'semicritical',
            fair: 'danger',
            good: 'normal',
            excellent: 'safe',
        };
        return mapper[status.toLowerCase()];
    }
}
export class CreditMixMetricSummaryMaker {
    constructor() {
        this.hasCreditCards = false;
        this.hasStudentLoans = false;
        this.hasAutoLoans = false;
        this.hasMortgages = false;
        this.hasOpenCreditCards = false;
        this.hasOpenStudentLoans = false;
        this.hasOpenAutoLoans = false;
        this.hasOpenMortgages = false;
        this.totalLineAmount = 0;
        this.creditCardAmount = 0;
        this.studentLoanAmount = 0;
        this.autoLoanAmount = 0;
        this.mortgageAmount = 0;
        this.amountOfClosed = 0;
        this.amountOfOpenCreditCards = 0;
    }
}
