import { IName } from 'libs/interfaces/mergereport.interface';
import { Homogenize } from 'libs/utils/mergereport/Base/HomogenizeData';

export class Name extends Homogenize<Partial<IName>> implements IName {
  prefix: string | null = null;
  first: string | null = null;
  middle: string | null = null;
  last: string | null = null;
  suffix: string | null = null;

  constructor(_data: Partial<IName>) {
    super(_data);
    this.homogenize(_data);
  }
}
