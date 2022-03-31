import { Homogenize } from '../../homogenize/homogenize-data';
export class SB168Frozen extends Homogenize {
    constructor(_data) {
        super(_data);
        this.equifax = null;
        this.experian = null;
        this.transunion = null;
        this.homogenize(_data);
    }
}
