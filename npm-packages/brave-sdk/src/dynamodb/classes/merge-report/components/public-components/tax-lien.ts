import { ITaxLien } from '../../../../../_types/merge-report';
import { Homogenize } from '../../../homogenize/homogenize-data';

export class TaxLien extends Homogenize<Partial<ITaxLien>> implements ITaxLien {
  amount: number | string | null = null;
  dateReleased: string | null = null;

  constructor(_data: Partial<ITaxLien>) {
    super(_data);
    this.homogenize(_data);
  }
}
