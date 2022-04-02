import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
import { Social } from './social';

export class SocialPartition extends Homogenize<Partial<SocialPartition>> {
  Social: Social[] = [];

  constructor(_data: Partial<SocialPartition>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.Social = this.homogenizeArray<Social, Social>(this.Social, Social);
  }
}
