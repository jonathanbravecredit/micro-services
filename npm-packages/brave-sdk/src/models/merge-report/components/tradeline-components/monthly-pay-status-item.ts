import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
import { CodeRef } from '../../common/code-ref';

export class MonthlyPayStatusItem extends Homogenize<Partial<MonthlyPayStatusItem>> {
  GenericRemark!: CodeRef;
  RatingRemark!: CodeRef;
  ComplianceRemark!: CodeRef;
  PaymentDue: number | string | null = null;
  CreditLimit: number | string | null = null;
  ActualPayment: number | string | null = null;
  PastDue: number | string | null = null;
  highCredit: number | string | null = null;
  status: string | null = null;
  date: string | null = null;
  currentBalance: number | string | null = null;
  changed: boolean | string | null = null;

  constructor(_data: Partial<MonthlyPayStatusItem>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.GenericRemark = new CodeRef(this.GenericRemark);
    this.RatingRemark = new CodeRef(this.RatingRemark);
    this.ComplianceRemark = new CodeRef(this.ComplianceRemark);
  }
}
