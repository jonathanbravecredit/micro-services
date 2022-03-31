import { Homogenize } from '../../homogenize/homogenize-data';
import { Inquiry } from './inquiry-components/inquiry';
export class InquiryPartition extends Homogenize {
    constructor(_data) {
        super(_data);
        this.homogenize(_data);
        this.init();
    }
    init() {
        this.Inquiry = new Inquiry(this.Inquiry);
    }
}
