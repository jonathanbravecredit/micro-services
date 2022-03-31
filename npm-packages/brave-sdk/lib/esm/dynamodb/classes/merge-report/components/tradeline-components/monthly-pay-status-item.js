import { Homogenize } from '../../../homogenize/homogenize-data';
import { CodeRef } from '../../common/code-ref';
export class MonthlyPayStatusItem extends Homogenize {
    constructor(_data) {
        super(_data);
        this.PaymentDue = null;
        this.CreditLimit = null;
        this.ActualPayment = null;
        this.PastDue = null;
        this.highCredit = null;
        this.status = null;
        this.date = null;
        this.currentBalance = null;
        this.changed = null;
        this.homogenize(_data);
        this.init();
    }
    init() {
        this.GenericRemark = new CodeRef(this.GenericRemark);
        this.RatingRemark = new CodeRef(this.RatingRemark);
        this.ComplianceRemark = new CodeRef(this.ComplianceRemark);
    }
}
