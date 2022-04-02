import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
import { CodeRef } from '../../common/code-ref';
import { Source } from '../../common/source';
import { PhoneNumber } from './phone-number';

export class BorrowerTelephone extends Homogenize<Partial<BorrowerTelephone>> {
  PhoneNumber!: PhoneNumber;
  PhoneType!: CodeRef;
  Source!: Source;
  partitionSet: number | string | null = null;
  dateReported: string | null = null;
  dateUpdated: string | null = null;

  constructor(_data: Partial<BorrowerTelephone>) {
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
