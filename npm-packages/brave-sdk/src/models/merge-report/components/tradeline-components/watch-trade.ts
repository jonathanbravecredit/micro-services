import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
import { CodeRef } from '../../common/code-ref';

export class WatchTrade extends Homogenize<Partial<WatchTrade>> {
  ContactMethod!: CodeRef;
  CreditType!: CodeRef;
  PreviousAccountCondition!: CodeRef;
  previousAmountPastDue: number | string | null = null;
  amountPastDue: number | string | null = null;

  constructor(_data: Partial<WatchTrade>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.ContactMethod = new CodeRef(this.ContactMethod);
    this.CreditType = new CodeRef(this.CreditType);
    this.PreviousAccountCondition = new CodeRef(this.PreviousAccountCondition);
  }
}
