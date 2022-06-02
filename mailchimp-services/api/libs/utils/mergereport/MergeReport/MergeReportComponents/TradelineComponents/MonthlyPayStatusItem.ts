import { IMonthlyPayStatusItem } from '@bravecredit/brave-sdk/dist/types/merge-report';
import { ICodeRef } from 'libs/interfaces/common.interface';
import { Homogenize } from 'libs/utils/mergereport/Base/HomogenizeData';
import { CodeRef } from 'libs/utils/mergereport/Common/CodeRef';

export class MonthlyPayStatusItem extends Homogenize<Partial<IMonthlyPayStatusItem>> implements IMonthlyPayStatusItem {
  GenericRemark!: ICodeRef;
  RatingRemark!: ICodeRef;
  ComplianceRemark!: ICodeRef;
  PaymentDue: number | string | null = null;
  CreditLimit: number | string | null = null;
  ActualPayment: number | string | null = null;
  PastDue: number | string | null = null;
  highCredit: number | string | null = null;
  status: string | null = null;
  date: string | null = null;
  currentBalance: number | string | null = null;
  changed: boolean | string | null = null;

  constructor(_data: Partial<IMonthlyPayStatusItem>) {
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
