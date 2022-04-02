import { ICodeRef, ISource } from '../../../../types';
import { IBorrowerTelephone, IPhoneNumber } from '../../../../types/merge-report';
import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
import { CodeRef } from '../../common/code-ref';
import { Source } from '../../common/source';
import { PhoneNumber } from './phone-number';

export class BorrowerTelephone extends Homogenize<Partial<IBorrowerTelephone>> implements IBorrowerTelephone {
  PhoneNumber!: IPhoneNumber;
  PhoneType!: ICodeRef;
  Source!: ISource;
  partitionSet: number | string | null = null;
  dateReported: string | null = null;
  dateUpdated: string | null = null;

  constructor(_data: Partial<IBorrowerTelephone>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.PhoneNumber = new PhoneNumber(this.PhoneNumber);
    this.PhoneType = new CodeRef(this.PhoneType);
    this.Source = new Source(this.Source);
  }
}
