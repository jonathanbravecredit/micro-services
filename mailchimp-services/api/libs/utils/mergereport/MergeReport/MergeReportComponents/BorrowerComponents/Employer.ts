import { ISource } from 'libs/interfaces/common.interface';
import { IEmployer, ICreditAddress } from 'libs/interfaces/mergereport.interface';
import { Homogenize } from 'libs/utils/mergereport/Base/HomogenizeData';
import { Source } from 'libs/utils/mergereport/Common/Source';
import { CreditAddress } from 'libs/utils/mergereport/Common/CreditAddress';

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
