import { Homogenize } from '../../../utils/homogenize/homogenize-data';
import { CodeRef } from '../common/code-ref';
import { CreditAddress } from '../common/credit-address';
import { Source } from '../common/source';
export class Subscriber extends Homogenize {
    constructor(_data) {
        super(_data);
        this.subscriberCode = null;
        this.telephone = null;
        this.name = null;
        this.homogenize(_data);
        this.init();
    }
    init() {
        this.CreditAddress = new CreditAddress(this.CreditAddress);
        this.IndustryCode = new CodeRef(this.IndustryCode);
        this.Source = new Source(this.Source);
    }
}
