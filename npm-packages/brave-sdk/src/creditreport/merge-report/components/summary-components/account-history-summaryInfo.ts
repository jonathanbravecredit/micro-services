import { ICodeRef } from '../../../../_types/common-tu';
import { IAccountHistorySummaryInfo } from '../../../../_types/merge-report';
import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
import { CodeRef } from '../../common/code-ref';

export class AccountHistorySummaryInfo
  extends Homogenize<Partial<IAccountHistorySummaryInfo>>
  implements IAccountHistorySummaryInfo
{
  SummaryType!: ICodeRef;
  TotalPaymentRatio: number | string | null = null;
  ActualPaymentAmount: number | string | null = null;
  PaymentDueAmount: number | string | null = null;
  TransactorRevolverIndicator: string | null = null;
  EndingBalanceAmount: number | string | null = null;
  AggregateExcessPaymentAmount: number | string | null = null;
  ActiveAccounts: number | string | null = null;
  OpenAccounts: number | string | null = null;
  TimePeriod: string | null = null;
  EstimatedSpendAmount: number | string | null = null;
  PriorMonthBalance: number | string | null = null;
  CreditLimitAmount: number | string | null = null;

  constructor(_data: Partial<IAccountHistorySummaryInfo>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.SummaryType = new CodeRef(this.SummaryType);
  }
}
