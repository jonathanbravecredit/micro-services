import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
export class Garnishment extends Homogenize {
    constructor(_data) {
        super(_data);
        this.amount = null;
        this.dateSatisfied = null;
        this.garnishee = null;
        this.plaintiff = null;
        this.homogenize(_data);
    }
}
