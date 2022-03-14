import { IMiscPublicRecord } from 'lib/interfaces/mergereport.interface';
import { Homogenize } from 'lib/utils/mergereport/Base/HomogenizeData';

export class MiscPublicRecord extends Homogenize<Partial<IMiscPublicRecord>> implements IMiscPublicRecord {
  miscInformation: string | null = null;

  constructor(_data: Partial<IMiscPublicRecord>) {
    super(_data);
    this.homogenize(_data);
  }
}
