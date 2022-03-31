import { Homogenize } from '../../../homogenize/homogenize-data';
import { CodeRef } from '../../common/code-ref';
export class PortfolioCreditSummaryInfo extends Homogenize {
    constructor(_data) {
        super(_data);
        this.CurrentPaymentDueAmount = null;
        this.PriorPaymentDueAmount = null;
        this.CurrentActualPaymentAmount = null;
        this.PastDueAmount = null;
        this.CreditLimitAmount = null;
        this.BalanceAmount = null;
        this.homogenize(_data);
        this.init();
    }
    init() {
        this.SummaryType = new CodeRef(this.SummaryType);
    }
}
