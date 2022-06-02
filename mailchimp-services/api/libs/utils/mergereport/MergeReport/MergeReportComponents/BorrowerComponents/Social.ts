import { ISource } from 'libs/interfaces/common.interface';
import { ISocial } from '@bravecredit/brave-sdk/dist/types/merge-report';
import { Homogenize } from 'libs/utils/mergereport/Base/HomogenizeData';
import { Source } from 'libs/utils/mergereport/Common/Source';

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
