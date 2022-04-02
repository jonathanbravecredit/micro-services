import { Homogenize } from '../../../utils/homogenize/homogenize-data';
import { Tradeline } from './tradeline-components/tradeline';

export class TradeLinePartition extends Homogenize<Partial<TradeLinePartition>> {
  Tradeline!: Tradeline;
  accountTypeDescription: string | null = null;
  accountTypeSymbol: string | null = null;
  accountTypeAbbreviation: string | null = null;

  constructor(_data: Partial<TradeLinePartition>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.Tradeline = new Tradeline(this.Tradeline);
  }
}
