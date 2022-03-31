import { Homogenize } from '../../homogenize/homogenize-data';
import { CodeRef } from './code-ref';
export class Remark extends Homogenize {
    constructor(_data) {
        super(_data);
        this.customRemark = null;
        this.homogenize(_data);
        this.init();
    }
    init() {
        this.RemarkCode = new CodeRef(this.RemarkCode);
    }
}
