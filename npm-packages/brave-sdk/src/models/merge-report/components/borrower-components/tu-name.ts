import { IName } from '../../../../types/merge-report';
import { Homogenize } from '../../../../utils/homogenize/homogenize-data';

export class TUName extends Homogenize<Partial<IName>> implements IName {
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
