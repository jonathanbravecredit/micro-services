import { IPortfolioCreditSummary, IPortfolioCreditSummaryInfo } from 'lib/interfaces/mergereport.interface';
import { Homogenize } from 'lib/utils/mergereport/Base/HomogenizeData';
import { PortfolioCreditSummaryInfo } from 'lib/utils/mergereport/MergeReport/MergeReportComponents/SummaryComponents/PortfolioCreditSummaryInfo';

export class PortfolioCreditSummary
  extends Homogenize<Partial<IPortfolioCreditSummary>>
  implements IPortfolioCreditSummary
{
  Transunion!: IPortfolioCreditSummaryInfo;

  constructor(_data: Partial<IPortfolioCreditSummary>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.Transunion = new PortfolioCreditSummaryInfo(this.Transunion);
  }
}
