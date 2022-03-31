import { Homogenize } from '../../../homogenize/homogenize-data';
import { CodeRef } from '../../common/code-ref';
import { Source } from '../../common/source';
import { PhoneNumber } from './phone-number';
export class BorrowerTelephone extends Homogenize {
    constructor(_data) {
        super(_data);
        this.partitionSet = null;
        this.dateReported = null;
        this.dateUpdated = null;
        this.homogenize(_data);
        this.init();
    }
    init() {
        this.PhoneNumber = new PhoneNumber(this.PhoneNumber);
        this.PhoneType = new CodeRef(this.PhoneType);
        this.Source = new Source(this.Source);
    }
}
