import { Homogenize } from '../../../homogenize/homogenize-data';
import { CodeRef } from '../../common/code-ref';
export class WatchTrade extends Homogenize {
    constructor(_data) {
        super(_data);
        this.previousAmountPastDue = null;
        this.amountPastDue = null;
        this.homogenize(_data);
        this.init();
    }
    init() {
        this.ContactMethod = new CodeRef(this.ContactMethod);
        this.CreditType = new CodeRef(this.CreditType);
        this.PreviousAccountCondition = new CodeRef(this.PreviousAccountCondition);
    }
}
