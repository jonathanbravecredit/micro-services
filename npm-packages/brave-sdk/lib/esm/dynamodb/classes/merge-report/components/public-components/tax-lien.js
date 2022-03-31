import { Homogenize } from '../../../homogenize/homogenize-data';
export class TaxLien extends Homogenize {
    constructor(_data) {
        super(_data);
        this.amount = null;
        this.dateReleased = null;
        this.homogenize(_data);
    }
}
