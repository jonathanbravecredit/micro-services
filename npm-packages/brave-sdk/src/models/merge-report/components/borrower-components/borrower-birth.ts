import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
import { Source } from '../../common/source';
import { TUDate } from '../../common/tu-date';

export class BorrowerBirth extends Homogenize<Partial<BorrowerBirth>> {
  BirthDate!: TUDate;
  Source!: Source;
  date: string | null = null;
  age: number | null = null;
  partitionSet: number | string | null = null;

  constructor(_data: Partial<BorrowerBirth>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.BirthDate = new TUDate(this.BirthDate);
    this.Source = new Source(this.Source);
  }
}
