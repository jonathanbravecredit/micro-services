import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
import { CodeRef } from '../../common/code-ref';
import { PayStatusHistory } from './pay-status-history';
export class GrantedTrade extends Homogenize {
    constructor(_data) {
        super(_data);
        this.CreditLimit = null;
        this.monthsReviewed = null;
        this.monthlyPayment = null;
        this.late90Count = null;
        this.late60Count = null;
        this.late30Count = null;
        this.actualPaymentAmount = null;
        this.worstPatStatusCount = null;
        this.termMonths = null;
        this.dateLastPayment = null;
        this.collateral = null;
        this.amountPastDue = null;
        this.dateWorstPayStatus = null;
        this.datePastDue = null;
        this.homogenize(_data);
        this.init();
    }
    init() {
        this.AccountType = new CodeRef(this.AccountType);
        this.CreditType = new CodeRef(this.CreditType);
        this.PaymentFrequency = new CodeRef(this.PaymentFrequency);
        this.TermType = new CodeRef(this.TermType);
        this.WorstPayStatus = new CodeRef(this.WorstPayStatus);
        this.PayStatusHistory = new PayStatusHistory(this.PayStatusHistory);
    }
}
