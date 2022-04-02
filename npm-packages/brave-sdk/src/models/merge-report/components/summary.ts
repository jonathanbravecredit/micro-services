import { Homogenize } from '../../../utils/homogenize/homogenize-data';
import { AccountHistorySummary } from './summary-components/account-history-summary';
import { InquirySummary } from './summary-components/inquiry-summary';
import { PortfolioCreditSummary } from './summary-components/portfolio-credit-summary';
import { PublicRecordSummary } from './summary-components/public-record-summary';
import { TradelineSummary } from './summary-components/tradeline-summary';

export class Summary extends Homogenize<Partial<Summary>> {
  TradelineSummary!: TradelineSummary;
  InquirySummary!: InquirySummary;
  PublicRecordSummary!: PublicRecordSummary;
  PortfolioCreditSummary: PortfolioCreditSummary[] = [];
  AccountHistorySummary: AccountHistorySummary[] = [];

  constructor(_data: Partial<Summary>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.TradelineSummary = new TradelineSummary(this.TradelineSummary);
    this.InquirySummary = new InquirySummary(this.InquirySummary);
    this.PublicRecordSummary = new PublicRecordSummary(this.PublicRecordSummary);
    this.PortfolioCreditSummary = this.homogenizeArray<PortfolioCreditSummary, PortfolioCreditSummary>(
      this.PortfolioCreditSummary,
      PortfolioCreditSummary,
    );
    this.AccountHistorySummary = this.homogenizeArray<AccountHistorySummary, AccountHistorySummary>(
      this.AccountHistorySummary,
      AccountHistorySummary,
    );
  }
}
