import { Homogenize } from '../../../homogenize/homogenize-data';
export class FinancialCounseling extends Homogenize {
    constructor(_data) {
        super(_data);
        this.amount = null;
        this.dateChecked = null;
        this.dateSettled = null;
        this.homogenize(_data);
    }
}
