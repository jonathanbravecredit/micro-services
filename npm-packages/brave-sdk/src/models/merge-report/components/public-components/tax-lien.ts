import { Homogenize } from '../../../../utils/homogenize/homogenize-data';

export class TaxLien extends Homogenize<Partial<TaxLien>> {
  amount: number | string | null = null;
  dateReleased: string | null = null;

  constructor(_data: Partial<TaxLien>) {
    super(_data);
    this.homogenize(_data);
  }
}
