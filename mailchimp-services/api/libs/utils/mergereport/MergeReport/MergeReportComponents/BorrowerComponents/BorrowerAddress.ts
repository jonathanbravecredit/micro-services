import { ICodeRef, ISource } from 'libs/interfaces/common.interface';
import { IBorrowerAddress, ICreditAddress } from '@bravecredit/brave-sdk/dist/types/merge-report';
import { Homogenize } from 'libs/utils/mergereport/Base/HomogenizeData';
import { CodeRef } from 'libs/utils/mergereport/Common/CodeRef';
import { Source } from 'libs/utils/mergereport/Common/Source';
import { CreditAddress } from 'libs/utils/mergereport/Common/CreditAddress';

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
