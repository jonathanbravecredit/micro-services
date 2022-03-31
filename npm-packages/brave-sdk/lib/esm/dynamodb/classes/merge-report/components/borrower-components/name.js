import { Homogenize } from '../../../homogenize/homogenize-data';
export class Name extends Homogenize {
    constructor(_data) {
        super(_data);
        this.prefix = null;
        this.first = null;
        this.middle = null;
        this.last = null;
        this.suffix = null;
        this.homogenize(_data);
    }
}
