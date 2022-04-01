import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
import { CodeRef } from '../../common/code-ref';
import { CreditAddress } from '../../common/credit-address';
import { Source } from '../../common/source';
export class BorrowerAddress extends Homogenize {
    constructor(_data) {
        super(_data);
        this.Source = new Source({});
        this.dateReported = null;
        this.addressOrder = null;
        this.partitionSet = null;
        this.homogenize(_data);
        this.init();
    }
    init() {
        this.CreditAddress = !this.CreditAddress ? new CreditAddress({}) : new CreditAddress(this.CreditAddress); // for now
        this.Dwelling = !this.Dwelling ? new CodeRef({}) : new CodeRef(this.Dwelling);
        this.Origin = !this.Origin ? new CodeRef({}) : new CodeRef(this.Origin);
        this.Ownership = !this.Ownership ? new CodeRef({}) : new CodeRef(this.Ownership);
        this.Source = !this.Source ? new Source({}) : new Source(this.Source);
    }
}
