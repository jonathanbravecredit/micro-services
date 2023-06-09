import { ISource } from '../../../../types';
import { ISocial } from '../../../../types/merge-report';
import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
import { Source } from '../../common/source';

export class Social extends Homogenize<Partial<ISocial>> implements ISocial {
  SocialSecurityNumber: string | null = null;
  Source!: ISource;

  constructor(_data: Partial<ISocial>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.Source = new Source(this.Source);
  }
}
