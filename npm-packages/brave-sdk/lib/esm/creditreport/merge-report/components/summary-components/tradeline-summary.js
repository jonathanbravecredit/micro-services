import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
import { TradelineSummaryInfo } from './tradeline-summary-info';
export class TradelineSummary extends Homogenize {
    constructor(_data) {
        super(_data);
        this.homogenize(_data);
        this.init();
    }
    init() {
        this.Experian = new TradelineSummaryInfo(this.Experian);
        this.Equifax = new TradelineSummaryInfo(this.Equifax);
        this.TransUnion = new TradelineSummaryInfo(this.TransUnion);
        this.Merge = new TradelineSummaryInfo(this.Merge);
    }
}
