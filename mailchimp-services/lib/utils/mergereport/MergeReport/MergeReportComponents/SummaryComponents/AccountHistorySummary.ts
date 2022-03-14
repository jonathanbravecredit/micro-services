import { IAccountHistorySummary, IAccountHistorySummaryInfo } from 'lib/interfaces/mergereport.interface';
import { Homogenize } from 'lib/utils/mergereport/Base/HomogenizeData';
import { AccountHistorySummaryInfo } from 'lib/utils/mergereport/MergeReport/MergeReportComponents/SummaryComponents/AccountHistorySummaryInfo';

export class AccountHistorySummary
  extends Homogenize<Partial<IAccountHistorySummary>>
  implements IAccountHistorySummary
{
  Transunion!: IAccountHistorySummaryInfo;

  constructor(_data: Partial<IAccountHistorySummary>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.Transunion = new AccountHistorySummaryInfo(this.Transunion);
  }
}
