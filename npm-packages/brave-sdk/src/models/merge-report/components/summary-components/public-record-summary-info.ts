import { Homogenize } from '../../../../utils/homogenize/homogenize-data';

export class PublicRecordSummaryInfo extends Homogenize<Partial<PublicRecordSummaryInfo>> {
  NumberOfRecords: number | string | null = null;

  constructor(_data: Partial<PublicRecordSummaryInfo>) {
    super(_data);
    this.homogenize(_data);
  }
}
