import { ITradeline, ITradeLinePartition } from '@bravecredit/brave-sdk/dist/types/merge-report';
import { Homogenize } from 'libs/utils/mergereport/Base/HomogenizeData';
import { Tradeline } from 'libs/utils/mergereport/MergeReport/MergeReportComponents/TradelineComponents/Tradeline';

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
