import { IPublicPartition, IPublicRecord } from '@bravecredit/brave-sdk/dist/types/merge-report';
import { Homogenize } from 'libs/utils/mergereport/Base/HomogenizeData';
import { PublicRecord } from 'libs/utils/mergereport/MergeReport/MergeReportComponents/PublicComponents/PublicRecord';

export class PublicPartition extends Homogenize<Partial<IPublicPartition>> implements IPublicPartition {
  PublicRecord!: IPublicRecord;

  constructor(_data: Partial<IPublicPartition>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.PublicRecord = new PublicRecord(this.PublicRecord);
  }
}
