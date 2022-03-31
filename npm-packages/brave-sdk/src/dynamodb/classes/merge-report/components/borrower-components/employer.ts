import { ISource } from '../../../../../_types/common-tu';
import { IEmployer, ICreditAddress } from '../../../../../_types/merge-report';
import { Homogenize } from '../../../homogenize/homogenize-data';
import { CreditAddress } from '../../common/credit-address';
import { Source } from '../../common/source';

export class Employer extends Homogenize<Partial<IEmployer>> implements IEmployer {
  CreditAddress!: ICreditAddress;
  Source!: ISource;
  name!: string;
  partitionSet: number | string | null = null;
  dateReported: string | null = null;
  dateUpdated: string | null = null;

  constructor(_data: Partial<IEmployer>) {
    super(_data);
    this.homogenize(_data);
  }

  init(): void {
    this.CreditAddress = new CreditAddress(this.CreditAddress);
    this.Source = new Source(this.Source);
  }
}
