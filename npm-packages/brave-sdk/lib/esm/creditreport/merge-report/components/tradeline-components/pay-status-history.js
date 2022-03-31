import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
import { MonthlyPayStatusItem } from './monthly-pay-status-item';
export class PayStatusHistory extends Homogenize {
    constructor(_data) {
        super(_data);
        this.MonthlyPayStatus = [];
        this.startDate = null;
        this.status = null;
        this.homogenize(_data);
        this.init();
    }
    init() {
        this.MonthlyPayStatus = this.homogenizeArray(this.MonthlyPayStatus, MonthlyPayStatusItem);
    }
}
