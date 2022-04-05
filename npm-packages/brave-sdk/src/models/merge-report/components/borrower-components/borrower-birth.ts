import { IDate, ISource } from '../../../../types';
import { IBorrowerBirth } from '../../../../types/merge-report';
import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
import { Source } from '../../common/source';
import { TUDate } from '../../common/tu-date';

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
