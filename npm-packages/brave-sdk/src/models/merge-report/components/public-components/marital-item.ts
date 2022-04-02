import { IMaritalItem } from '../../../../types/merge-report';
import { Homogenize } from '../../../../utils/homogenize/homogenize-data';

export class MaritalItem extends Homogenize<Partial<IMaritalItem>> implements IMaritalItem {
  spouse: string | null = null;

  constructor(_data: Partial<IMaritalItem>) {
    super(_data);
    this.homogenize(_data);
  }
}
