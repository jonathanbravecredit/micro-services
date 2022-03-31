import { IPortfolioCreditSummary, IPortfolioCreditSummaryInfo } from '../../../../_types/merge-report';
import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
import { PortfolioCreditSummaryInfo } from './portfolio-credit-summary-info';

export class PortfolioCreditSummary
  extends Homogenize<Partial<IPortfolioCreditSummary>>
  implements IPortfolioCreditSummary
{
  TransUnion!: IPortfolioCreditSummaryInfo;

  constructor(_data: Partial<IPortfolioCreditSummary>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.TransUnion = new PortfolioCreditSummaryInfo(this.TransUnion);
  }
}
