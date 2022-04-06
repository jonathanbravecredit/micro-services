import { IPublicPartition, IPublicRecord } from '../../../types/merge-report';
import { Homogenize } from '../../../utils/homogenize/homogenize-data';
import { PublicRecord } from './public-components/public-record';

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
