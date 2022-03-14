import { IMaritalItem } from 'lib/interfaces/mergereport.interface';
import { Homogenize } from 'lib/utils/mergereport/Base/HomogenizeData';

export class MaritalItem extends Homogenize<Partial<IMaritalItem>> implements IMaritalItem {
  spouse: string | null = null;

  constructor(_data: Partial<IMaritalItem>) {
    super(_data);
    this.homogenize(_data);
  }
}
