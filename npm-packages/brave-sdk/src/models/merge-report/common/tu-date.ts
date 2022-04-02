import { Homogenize } from '../../../utils/homogenize/homogenize-data';

export class TUDate extends Homogenize<Partial<TUDate>> {
  month: string | number | null = null;
  year: string | number | null = null;
  day: string | number | null = null;

  constructor(_data: Partial<TUDate>) {
    super(_data);
    this.homogenize(_data);
  }
}
