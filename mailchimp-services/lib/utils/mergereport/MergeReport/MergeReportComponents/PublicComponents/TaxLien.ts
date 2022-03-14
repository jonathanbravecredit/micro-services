import { ITaxLien } from 'lib/interfaces/mergereport.interface';
import { Homogenize } from 'lib/utils/mergereport/Base/HomogenizeData';

export class TaxLien extends Homogenize<Partial<ITaxLien>> implements ITaxLien {
  amount: number | string | null = null;
  dateReleased: string | null = null;

  constructor(_data: Partial<ITaxLien>) {
    super(_data);
    this.homogenize(_data);
  }
}
