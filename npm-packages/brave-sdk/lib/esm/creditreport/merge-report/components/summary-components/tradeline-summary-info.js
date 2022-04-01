import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
import { CodeRef } from '../../common/code-ref';
export class TradelineSummaryInfo extends Homogenize {
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
        this.RecentDeliquencyMOP = new CodeRef(this.RecentDeliquencyMOP);
    }
}
