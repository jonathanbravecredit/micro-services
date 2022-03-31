import { Homogenize } from '../../../homogenize/homogenize-data';
export class PhoneNumber extends Homogenize {
    constructor(_data) {
        super(_data);
        this.AreaCode = null;
        this.Number = null;
        this.Extension = null;
        this.homogenize(_data);
    }
}
