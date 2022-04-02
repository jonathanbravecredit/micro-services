import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
import { CreditAddress } from '../../common/credit-address';
import { Source } from '../../common/source';

export class Employer extends Homogenize<Partial<Employer>> {
  CreditAddress!: CreditAddress;
  Source!: Source;
  name!: string;
  partitionSet: number | string | null = null;
  dateReported: string | null = null;
  dateUpdated: string | null = null;

  constructor(_data: Partial<Employer>) {
    super(_data);
    this.homogenize(_data);
  }

  init(): void {
    this.CreditAddress = new CreditAddress(this.CreditAddress);
    this.Source = new Source(this.Source);
  }
}
