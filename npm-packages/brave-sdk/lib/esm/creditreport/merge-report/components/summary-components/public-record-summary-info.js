import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
export class PublicRecordSummaryInfo extends Homogenize {
    constructor(_data) {
        super(_data);
        this.NumberOfRecords = null;
        this.homogenize(_data);
    }
}
