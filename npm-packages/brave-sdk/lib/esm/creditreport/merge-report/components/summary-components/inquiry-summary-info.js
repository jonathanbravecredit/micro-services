import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
export class InquirySummaryInfo extends Homogenize {
    constructor(_data) {
        super(_data);
        this.NumberInLast2Years = null;
        this.homogenize(_data);
    }
}
