import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
import { AccountHistorySummaryInfo } from './account-history-summaryInfo';
export class AccountHistorySummary extends Homogenize {
    constructor(_data) {
        super(_data);
        this.homogenize(_data);
        this.init();
    }
    init() {
        this.TransUnion = new AccountHistorySummaryInfo(this.TransUnion);
    }
}
