import { IAccountHistorySummary, IInquirySummary, IPortfolioCreditSummary, IPublicRecordSummary, ISummary, ITradelineSummary } from '@bravecredit/brave-sdk/dist/types/merge-report';
import { Homogenize } from 'libs/utils/mergereport/Base/HomogenizeData';
import { AccountHistorySummary } from 'libs/utils/mergereport/MergeReport/MergeReportComponents/SummaryComponents/AccountHistorySummary';
import { InquirySummary } from 'libs/utils/mergereport/MergeReport/MergeReportComponents/SummaryComponents/InquirySummary';
import { PortfolioCreditSummary } from 'libs/utils/mergereport/MergeReport/MergeReportComponents/SummaryComponents/PortfolioCreditSummary';
import { PublicRecordSummary } from 'libs/utils/mergereport/MergeReport/MergeReportComponents/SummaryComponents/PublicRecordSummary';
import { TradelineSummary } from 'libs/utils/mergereport/MergeReport/MergeReportComponents/SummaryComponents/TradelineSummary';

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
