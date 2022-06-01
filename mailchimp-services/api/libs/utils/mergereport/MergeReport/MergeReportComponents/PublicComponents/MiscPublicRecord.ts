import { IMiscPublicRecord } from 'libs/interfaces/mergereport.interface';
import { Homogenize } from 'libs/utils/mergereport/Base/HomogenizeData';

export class MiscPublicRecord extends Homogenize<Partial<IMiscPublicRecord>> implements IMiscPublicRecord {
  miscInformation: string | null = null;

  constructor(_data: Partial<IMiscPublicRecord>) {
    super(_data);
    this.homogenize(_data);
  }
}
