import { ICodeRef } from 'lib/interfaces/common.interface';
import { IWatchTrade } from 'lib/interfaces/mergereport.interface';
import { Homogenize } from 'lib/utils/mergereport/Base/HomogenizeData';
import { CodeRef } from 'lib/utils/mergereport/Common/CodeRef';

export class WatchTrade extends Homogenize<Partial<IWatchTrade>> implements IWatchTrade {
  ContactMethod!: ICodeRef;
  CreditType!: ICodeRef;
  PreviousAccountCondition!: ICodeRef;
  previousAmountPastDue: number | string | null = null;
  amountPastDue: number | string | null = null;

  constructor(_data: Partial<IWatchTrade>) {
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
