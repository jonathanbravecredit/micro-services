import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
import { TradelineSummaryInfo } from './tradeline-summary-info';

export class TradelineSummary extends Homogenize<Partial<TradelineSummary>> {
  Experian!: TradelineSummaryInfo;
  Equifax!: TradelineSummaryInfo;
  TransUnion!: TradelineSummaryInfo;
  Merge!: TradelineSummaryInfo;

  constructor(_data: Partial<TradelineSummary>) {
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
