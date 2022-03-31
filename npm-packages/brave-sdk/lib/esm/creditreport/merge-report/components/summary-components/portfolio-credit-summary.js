import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
import { PortfolioCreditSummaryInfo } from './portfolio-credit-summary-info';
export class PortfolioCreditSummary extends Homogenize {
    constructor(_data) {
        super(_data);
        this.homogenize(_data);
        this.init();
    }
    init() {
        this.TransUnion = new PortfolioCreditSummaryInfo(this.TransUnion);
    }
}
