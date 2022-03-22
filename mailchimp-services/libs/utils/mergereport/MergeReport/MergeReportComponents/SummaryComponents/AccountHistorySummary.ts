import { IAccountHistorySummary, IAccountHistorySummaryInfo } from 'libs/interfaces/mergereport.interface';
import { Homogenize } from 'libs/utils/mergereport/Base/HomogenizeData';
import { AccountHistorySummaryInfo } from 'libs/utils/mergereport/MergeReport/MergeReportComponents/SummaryComponents/AccountHistorySummaryInfo';

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
