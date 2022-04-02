import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
import { AccountHistorySummaryInfo } from './account-history-summaryInfo';

export class AccountHistorySummary extends Homogenize<Partial<AccountHistorySummary>> {
  TransUnion!: AccountHistorySummaryInfo;

  constructor(_data: Partial<AccountHistorySummary>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.TransUnion = new AccountHistorySummaryInfo(this.TransUnion);
  }
}
