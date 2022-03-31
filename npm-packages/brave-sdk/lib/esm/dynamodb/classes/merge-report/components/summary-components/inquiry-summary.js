import { Homogenize } from '../../../homogenize/homogenize-data';
import { InquirySummaryInfo } from './inquiry-summary-info';
export class InquirySummary extends Homogenize {
    constructor(_data) {
        super(_data);
        this.homogenize(_data);
        this.init();
    }
    init() {
        this.Experian = new InquirySummaryInfo(this.Experian);
        this.Equifax = new InquirySummaryInfo(this.Equifax);
        this.TransUnion = new InquirySummaryInfo(this.TransUnion);
        this.Merge = new InquirySummaryInfo(this.Merge);
    }
}
