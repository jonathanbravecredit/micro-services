import { IMiscPublicRecord } from '../../../../types/merge-report';
import { Homogenize } from '../../../../utils/homogenize/homogenize-data';

export class MiscPublicRecord extends Homogenize<Partial<IMiscPublicRecord>> implements IMiscPublicRecord {
  miscInformation: string | null = null;

  constructor(_data: Partial<IMiscPublicRecord>) {
    super(_data);
    this.homogenize(_data);
  }
}
