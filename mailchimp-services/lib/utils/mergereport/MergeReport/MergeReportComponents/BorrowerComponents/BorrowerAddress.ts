import { ICodeRef, ISource } from 'lib/interfaces/common.interface';
import { IBorrowerAddress, ICreditAddress } from 'lib/interfaces/mergereport.interface';
import { Homogenize } from 'lib/utils/mergereport/Base/HomogenizeData';
import { CodeRef } from 'lib/utils/mergereport/Common/CodeRef';
import { Source } from 'lib/utils/mergereport/Common/Source';
import { CreditAddress } from 'lib/utils/mergereport/Common/CreditAddress';

export class BorrowerAddress extends Homogenize<Partial<IBorrowerAddress>> implements IBorrowerAddress {
  CreditAddress!: ICreditAddress;
  Dwelling!: ICodeRef;
  Origin!: ICodeRef;
  Ownership!: ICodeRef;
  Source: ISource = new Source({});
  dateReported: string | null = null;
  addressOrder: number | null = null;
  partitionSet: number | null = null;

  constructor(_data: Partial<IBorrowerAddress>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.CreditAddress = !this.CreditAddress ? new CreditAddress({}) : new CreditAddress(this.CreditAddress); // for now
    this.Dwelling = !this.Dwelling ? new CodeRef({}) : new CodeRef(this.Dwelling);
    this.Origin = !this.Origin ? new CodeRef({}) : new CodeRef(this.Origin);
    this.Ownership = !this.Ownership ? new CodeRef({}) : new CodeRef(this.Ownership);
    this.Source = !this.Source ? new Source({}) : new Source(this.Source);
  }
}
