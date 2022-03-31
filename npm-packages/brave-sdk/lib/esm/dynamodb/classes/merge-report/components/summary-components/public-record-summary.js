import { Homogenize } from '../../../homogenize/homogenize-data';
import { PublicRecordSummaryInfo } from './public-record-summary-info';
export class PublicRecordSummary extends Homogenize {
    constructor(_data) {
        super(_data);
        this.homogenize(_data);
        this.init();
    }
    init() {
        this.Experian = new PublicRecordSummaryInfo(this.Experian);
        this.Equifax = new PublicRecordSummaryInfo(this.Equifax);
        this.TransUnion = new PublicRecordSummaryInfo(this.TransUnion);
        this.Merge = new PublicRecordSummaryInfo(this.Merge);
    }
}
