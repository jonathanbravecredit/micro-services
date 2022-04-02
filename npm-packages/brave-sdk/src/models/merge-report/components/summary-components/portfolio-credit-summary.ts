import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
import { PortfolioCreditSummaryInfo } from './portfolio-credit-summary-info';

export class PortfolioCreditSummary extends Homogenize<Partial<PortfolioCreditSummary>> {
  TransUnion!: PortfolioCreditSummaryInfo;

  constructor(_data: Partial<PortfolioCreditSummary>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.TransUnion = new PortfolioCreditSummaryInfo(this.TransUnion);
  }
}
