import { Homogenize } from '../../homogenize/homogenize-data';
import { CodeRef } from '../common/code-ref';
export class Message extends Homogenize {
    constructor(_data) {
        super(_data);
        this.homogenize(_data);
        this.init();
    }
    init() {
        this.Code = new CodeRef(this.Code);
        this.Type = new CodeRef(this.Type);
    }
}
