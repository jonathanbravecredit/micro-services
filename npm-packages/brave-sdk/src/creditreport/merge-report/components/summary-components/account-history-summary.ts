import { IAccountHistorySummary, IAccountHistorySummaryInfo } from '../../../../_types/merge-report';
import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
import { AccountHistorySummaryInfo } from './account-history-summaryInfo';

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
