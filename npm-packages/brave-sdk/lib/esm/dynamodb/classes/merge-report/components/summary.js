import { Homogenize } from '../../homogenize/homogenize-data';
import { AccountHistorySummary } from './summary-components/account-history-summary';
import { InquirySummary } from './summary-components/inquiry-summary';
import { PortfolioCreditSummary } from './summary-components/portfolio-credit-summary';
import { PublicRecordSummary } from './summary-components/public-record-summary';
import { TradelineSummary } from './summary-components/tradeline-summary';
export class Summary extends Homogenize {
    constructor(_data) {
        super(_data);
        this.PortfolioCreditSummary = [];
        this.AccountHistorySummary = [];
        this.homogenize(_data);
        this.init();
    }
    init() {
        this.TradelineSummary = new TradelineSummary(this.TradelineSummary);
        this.InquirySummary = new InquirySummary(this.InquirySummary);
        this.PublicRecordSummary = new PublicRecordSummary(this.PublicRecordSummary);
        this.PortfolioCreditSummary = this.homogenizeArray(this.PortfolioCreditSummary, PortfolioCreditSummary);
        this.AccountHistorySummary = this.homogenizeArray(this.AccountHistorySummary, AccountHistorySummary);
    }
}
