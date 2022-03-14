import { ISocial, ISocialPartition } from 'lib/interfaces/mergereport.interface';
import { Homogenize } from 'lib/utils/mergereport/Base/HomogenizeData';
import { Social } from 'lib/utils/mergereport/MergeReport/MergeReportComponents/BorrowerComponents/Social';

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
