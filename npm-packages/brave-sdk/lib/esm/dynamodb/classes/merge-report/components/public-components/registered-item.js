import { Homogenize } from '../../../homogenize/homogenize-data';
import { CodeRef } from '../../common/code-ref';
export class RegisteredItem extends Homogenize {
    constructor(_data) {
        super(_data);
        this.Security = [];
        this.originalBalance = null;
        this.dateMatures = null;
        this.homogenize(_data);
        this.init();
    }
    init() {
        this.Security = this.homogenizeArray(this.Security, CodeRef);
    }
}
