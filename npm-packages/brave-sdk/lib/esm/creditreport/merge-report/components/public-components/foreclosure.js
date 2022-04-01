import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
export class Foreclosure extends Homogenize {
    constructor(_data) {
        super(_data);
        this.dateSettled = null;
        this.liability = null;
        this.homogenize(_data);
    }
}
