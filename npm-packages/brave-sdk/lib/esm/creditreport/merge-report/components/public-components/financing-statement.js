import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
import { CodeRef } from '../../common/code-ref';
export class FinancingStatement extends Homogenize {
    constructor(_data) {
        super(_data);
        this.dateMaturity = null;
        this.homogenize(_data);
        this.init();
    }
    init() {
        this.CreditorType = new CodeRef(this.CreditorType);
    }
}
