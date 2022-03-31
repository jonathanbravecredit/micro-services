import { ISource } from '../../../../../_types/common-tu';
import { ISocial } from '../../../../../_types/merge-report';
import { Homogenize } from '../../../homogenize/homogenize-data';
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
