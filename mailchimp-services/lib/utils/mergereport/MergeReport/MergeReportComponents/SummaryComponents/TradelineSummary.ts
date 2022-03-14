import { ITradelineSummary, ITradelineSummaryInfo } from 'lib/interfaces/mergereport.interface';
import { Homogenize } from 'lib/utils/mergereport/Base/HomogenizeData';
import { TradelineSummaryInfo } from 'lib/utils/mergereport/MergeReport/MergeReportComponents/SummaryComponents/TradelineSummaryInfo';

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
