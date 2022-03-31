import { Homogenize } from '../../../homogenize/homogenize-data';
export class MaritalItem extends Homogenize {
    constructor(_data) {
        super(_data);
        this.spouse = null;
        this.homogenize(_data);
    }
}
