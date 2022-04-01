import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
import { CodeRef } from '../../common/code-ref';
export class CollectionTrade extends Homogenize {
    constructor(_data) {
        super(_data);
        this.actualPaymentAmount = null;
        this.originalCreditor = null;
        this.homogenize(_data);
        this.init();
    }
    init() {
        this.creditType = new CodeRef(this.creditType);
    }
}
