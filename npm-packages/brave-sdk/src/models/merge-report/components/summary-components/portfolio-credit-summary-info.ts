import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
import { CodeRef } from '../../common/code-ref';

export class PortfolioCreditSummaryInfo extends Homogenize<Partial<PortfolioCreditSummaryInfo>> {
  SummaryType!: CodeRef;
  CurrentPaymentDueAmount: number | string | null = null;
  PriorPaymentDueAmount: number | string | null = null;
  CurrentActualPaymentAmount: number | string | null = null;
  PastDueAmount: number | string | null = null;
  CreditLimitAmount: number | string | null = null;
  BalanceAmount: number | string | null = null;

  constructor(_data: Partial<PortfolioCreditSummaryInfo>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.SummaryType = new CodeRef(this.SummaryType);
  }
}
