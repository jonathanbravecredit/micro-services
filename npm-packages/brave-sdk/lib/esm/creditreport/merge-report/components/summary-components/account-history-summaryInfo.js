import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
import { CodeRef } from '../../common/code-ref';
export class AccountHistorySummaryInfo extends Homogenize {
    constructor(_data) {
        super(_data);
        this.TotalPaymentRatio = null;
        this.ActualPaymentAmount = null;
        this.PaymentDueAmount = null;
        this.TransactorRevolverIndicator = null;
        this.EndingBalanceAmount = null;
        this.AggregateExcessPaymentAmount = null;
        this.ActiveAccounts = null;
        this.OpenAccounts = null;
        this.TimePeriod = null;
        this.EstimatedSpendAmount = null;
        this.PriorMonthBalance = null;
        this.CreditLimitAmount = null;
        this.homogenize(_data);
        this.init();
    }
    init() {
        this.SummaryType = new CodeRef(this.SummaryType);
    }
}
