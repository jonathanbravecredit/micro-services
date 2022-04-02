import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
import { Source } from '../../common/source';

export class Social extends Homogenize<Partial<Social>> {
  SocialSecurityNumber: string | null = null;
  Source!: Source;

  constructor(_data: Partial<Social>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.Source = new Source(this.Source);
  }
}
