import { Homogenize } from '../../../homogenize/homogenize-data';
import { CodeRef } from '../../common/code-ref';
import { Source } from '../../common/source';
export class Inquiry extends Homogenize {
    constructor(_data) {
        super(_data);
        this.bureau = null;
        this.inquiryType = null;
        this.subscriberNumber = null;
        this.inquiryDate = null;
        this.subscriberName = null;
        this.homogenize(_data);
        this.init();
    }
    init() {
        this.IndustryCode = new CodeRef(this.IndustryCode);
        this.Source = new Source(this.Source);
    }
}
