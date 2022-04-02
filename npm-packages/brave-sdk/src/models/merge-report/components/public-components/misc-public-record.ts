import { Homogenize } from '../../../../utils/homogenize/homogenize-data';

export class MiscPublicRecord extends Homogenize<Partial<MiscPublicRecord>> {
  miscInformation: string | null = null;

  constructor(_data: Partial<MiscPublicRecord>) {
    super(_data);
    this.homogenize(_data);
  }
}
