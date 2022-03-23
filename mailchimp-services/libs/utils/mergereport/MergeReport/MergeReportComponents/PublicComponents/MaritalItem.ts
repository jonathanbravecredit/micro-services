import { IMaritalItem } from 'libs/interfaces/mergereport.interface';
import { Homogenize } from 'libs/utils/mergereport/Base/HomogenizeData';

export class MaritalItem extends Homogenize<Partial<IMaritalItem>> implements IMaritalItem {
  spouse: string | null = null;

  constructor(_data: Partial<IMaritalItem>) {
    super(_data);
    this.homogenize(_data);
  }
}
