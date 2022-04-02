import { Homogenize } from '../../../utils/homogenize/homogenize-data';

export class SB168Frozen extends Homogenize<Partial<SB168Frozen>> {
  equifax: boolean | null = null;
  experian: boolean | null = null;
  transunion: boolean | null = null;

  constructor(_data: Partial<SB168Frozen>) {
    super(_data);
    this.homogenize(_data);
  }
}
