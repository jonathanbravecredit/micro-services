import { Homogenize } from '../../../utils/homogenize/homogenize-data';
import { CodeRef } from './code-ref';
export class Source extends Homogenize {
    constructor(_data) {
        super(_data);
        this.BorrowerKey = null;
        this.InquiryDate = null;
        this.Reference = null;
        this.homogenize(_data);
        this.init();
    }
    init() {
        this.Bureau = new CodeRef(this.Bureau);
    }
}
