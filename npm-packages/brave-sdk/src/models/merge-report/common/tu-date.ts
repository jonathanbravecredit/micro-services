import { IDate } from '../../../types';
import { Homogenize } from '../../../utils/homogenize/homogenize-data';

export class TUDate extends Homogenize<Partial<IDate>> implements IDate {
  month: string | number | null = null;
  year: string | number | null = null;
  day: string | number | null = null;

  constructor(_data: Partial<IDate>) {
    super(_data);
    this.homogenize(_data);
  }
}
