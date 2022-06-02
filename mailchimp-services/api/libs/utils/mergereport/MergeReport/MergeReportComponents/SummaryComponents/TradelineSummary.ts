import { ITradelineSummary, ITradelineSummaryInfo } from '@bravecredit/brave-sdk/dist/types/merge-report';
import { Homogenize } from 'libs/utils/mergereport/Base/HomogenizeData';
import { TradelineSummaryInfo } from 'libs/utils/mergereport/MergeReport/MergeReportComponents/SummaryComponents/TradelineSummaryInfo';

export class TradelineSummary extends Homogenize<Partial<ITradelineSummary>> implements ITradelineSummary {
  Experian!: ITradelineSummaryInfo;
  Equifax!: ITradelineSummaryInfo;
  TransUnion!: ITradelineSummaryInfo;
  Merge!: ITradelineSummaryInfo;

  constructor(_data: Partial<ITradelineSummary>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.Experian = new TradelineSummaryInfo(this.Experian);
    this.Equifax = new TradelineSummaryInfo(this.Equifax);
    this.TransUnion = new TradelineSummaryInfo(this.TransUnion);
    this.Merge = new TradelineSummaryInfo(this.Merge);
  }
}
