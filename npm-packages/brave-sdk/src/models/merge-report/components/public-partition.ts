import { Homogenize } from '../../../utils/homogenize/homogenize-data';
import { PublicRecord } from './public-components/public-record';

export class PublicPartition extends Homogenize<Partial<PublicPartition>> {
  PublicRecord!: PublicRecord;

  constructor(_data: Partial<PublicPartition>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.PublicRecord = new PublicRecord(this.PublicRecord);
  }
}
