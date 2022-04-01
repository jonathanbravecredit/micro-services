import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
import { CodeRef } from '../../common/code-ref';
export class CreditScoreFactor extends Homogenize {
    constructor(_data) {
        super(_data);
        this.FactorText = [];
        this.FactorType = null;
        this.bureauCode = null;
        this.homogenize(_data);
        this.init();
    }
    init() {
        this.Factor = new CodeRef(this.Factor);
    }
}
