import { Homogenize } from '../../../homogenize/homogenize-data';
import { CreditAddress } from '../../common/credit-address';
import { Source } from '../../common/source';
export class Employer extends Homogenize {
    constructor(_data) {
        super(_data);
        this.partitionSet = null;
        this.dateReported = null;
        this.dateUpdated = null;
        this.homogenize(_data);
    }
    init() {
        this.CreditAddress = new CreditAddress(this.CreditAddress);
        this.Source = new Source(this.Source);
    }
}
