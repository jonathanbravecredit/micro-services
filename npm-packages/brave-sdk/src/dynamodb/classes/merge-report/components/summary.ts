import {
  ISummary,
  ITradelineSummary,
  IInquirySummary,
  IPublicRecordSummary,
  IPortfolioCreditSummary,
  IAccountHistorySummary,
} from '../../../../_types/merge-report';
import { Homogenize } from '../../homogenize/homogenize-data';
import { AccountHistorySummary } from './summary-components/account-history-summary';
import { InquirySummary } from './summary-components/inquiry-summary';
import { PortfolioCreditSummary } from './summary-components/portfolio-credit-summary';
import { PublicRecordSummary } from './summary-components/public-record-summary';
import { TradelineSummary } from './summary-components/tradeline-summary';

export class Summary extends Homogenize<Partial<ISummary>> implements ISummary {
  TradelineSummary!: ITradelineSummary;
  InquirySummary!: IInquirySummary;
  PublicRecordSummary!: IPublicRecordSummary;
  PortfolioCreditSummary: IPortfolioCreditSummary[] = [];
  AccountHistorySummary: IAccountHistorySummary[] = [];

  constructor(_data: Partial<ISummary>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.TradelineSummary = new TradelineSummary(this.TradelineSummary);
    this.InquirySummary = new InquirySummary(this.InquirySummary);
    this.PublicRecordSummary = new PublicRecordSummary(this.PublicRecordSummary);
    this.PortfolioCreditSummary = this.homogenizeArray<IPortfolioCreditSummary, PortfolioCreditSummary>(
      this.PortfolioCreditSummary,
      PortfolioCreditSummary,
    );
    this.AccountHistorySummary = this.homogenizeArray<IAccountHistorySummary, AccountHistorySummary>(
      this.AccountHistorySummary,
      AccountHistorySummary,
    );
  }
}
