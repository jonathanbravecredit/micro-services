import { IDate, ISource } from 'libs/interfaces/common.interface';
import { IBorrowerBirth } from '@bravecredit/brave-sdk/dist/types/merge-report';
import { Homogenize } from 'libs/utils/mergereport/Base/HomogenizeData';
import { Source } from 'libs/utils/mergereport/Common/Source';
import { TUDate } from 'libs/utils/mergereport/Common/TUDate';

export class BorrowerBirth extends Homogenize<Partial<IBorrowerBirth>> implements IBorrowerBirth {
  BirthDate!: IDate;
  Source!: ISource;
  date: string | null = null;
  age: number | null = null;
  partitionSet: number | string | null = null;

  constructor(_data: Partial<IBorrowerBirth>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.BirthDate = new TUDate(this.BirthDate);
    this.Source = new Source(this.Source);
  }
}
