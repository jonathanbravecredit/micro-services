import { Homogenize } from '../../../../utils/homogenize/homogenize-data';

export class TUName extends Homogenize<Partial<TUName>> {
  prefix: string | null = null;
  first: string | null = null;
  middle: string | null = null;
  last: string | null = null;
  suffix: string | null = null;

  constructor(_data: Partial<TUName>) {
    super(_data);
    this.homogenize(_data);
  }
}
