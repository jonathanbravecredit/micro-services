import { ISB168Frozen } from 'libs/interfaces/mergereport.interface';
import { Homogenize } from 'libs/utils/mergereport/Base/HomogenizeData';

export class SB168Frozen extends Homogenize<Partial<ISB168Frozen>> implements ISB168Frozen {
  equifax: boolean | null = null;
  experian: boolean | null = null;
  transunion: boolean | null = null;

  constructor(_data: Partial<ISB168Frozen>) {
    super(_data);
    this.homogenize(_data);
  }
}
