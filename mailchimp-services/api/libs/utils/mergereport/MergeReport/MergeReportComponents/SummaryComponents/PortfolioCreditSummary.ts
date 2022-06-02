import { IPortfolioCreditSummary, IPortfolioCreditSummaryInfo } from '@bravecredit/brave-sdk/dist/types/merge-report';
import { Homogenize } from 'libs/utils/mergereport/Base/HomogenizeData';
import { PortfolioCreditSummaryInfo } from 'libs/utils/mergereport/MergeReport/MergeReportComponents/SummaryComponents/PortfolioCreditSummaryInfo';

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
