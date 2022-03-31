import { Homogenize } from '../../homogenize/homogenize-data';
export class TUDate extends Homogenize {
    constructor(_data) {
        super(_data);
        this.month = null;
        this.year = null;
        this.day = null;
        this.homogenize(_data);
    }
}
