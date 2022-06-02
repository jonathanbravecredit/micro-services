import { IAccountHistorySummary, IAccountHistorySummaryInfo } from '@bravecredit/brave-sdk/dist/types/merge-report';
import { Homogenize } from 'libs/utils/mergereport/Base/HomogenizeData';
import { AccountHistorySummaryInfo } from 'libs/utils/mergereport/MergeReport/MergeReportComponents/SummaryComponents/AccountHistorySummaryInfo';

export class AccountHistorySummary
  extends Homogenize<Partial<IAccountHistorySummary>>
  implements IAccountHistorySummary
{
  TransUnion!: IAccountHistorySummaryInfo;

  constructor(_data: Partial<IAccountHistorySummary>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.TransUnion = new AccountHistorySummaryInfo(this.TransUnion);
  }
}
