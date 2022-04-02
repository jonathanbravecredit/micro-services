import { Homogenize } from '../../../../utils/homogenize/homogenize-data';

export class MaritalItem extends Homogenize<Partial<MaritalItem>> {
  spouse: string | null = null;

  constructor(_data: Partial<MaritalItem>) {
    super(_data);
    this.homogenize(_data);
  }
}
