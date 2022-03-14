import { ITradeline, ITradeLinePartition } from 'lib/interfaces/mergereport.interface';
import { Homogenize } from 'lib/utils/mergereport/Base/HomogenizeData';
import { Tradeline } from 'lib/utils/mergereport/MergeReport/MergeReportComponents/TradelineComponents/Tradeline';

export class TradeLinePartition extends Homogenize<Partial<ITradeLinePartition>> implements ITradeLinePartition {
  Tradeline!: ITradeline;
  accountTypeDescription: string | null = null;
  accountTypeSymbol: string | null = null;
  accountTypeAbbreviation: string | null = null;

  constructor(_data: Partial<ITradeLinePartition>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.Tradeline = new Tradeline(this.Tradeline);
  }
}
