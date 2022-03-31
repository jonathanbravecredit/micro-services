import { ISocialPartition, ISocial } from '../../../../../_types/merge-report';
import { Homogenize } from '../../../homogenize/homogenize-data';
import { Social } from './social';

export class SocialPartition extends Homogenize<Partial<ISocialPartition>> implements ISocialPartition {
  Social: ISocial[] = [];

  constructor(_data: Partial<ISocialPartition>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.Social = this.homogenizeArray<ISocial, Social>(this.Social, Social);
  }
}
