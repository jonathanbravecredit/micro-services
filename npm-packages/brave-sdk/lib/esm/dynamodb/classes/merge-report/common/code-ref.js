import { Homogenize } from '../../homogenize/homogenize-data';
export class CodeRef extends Homogenize {
    constructor(_data) {
        super(_data);
        this.abbreviation = null;
        this.description = null;
        this.symbol = null;
        this.rank = null;
        this.homogenize(_data);
    }
}
