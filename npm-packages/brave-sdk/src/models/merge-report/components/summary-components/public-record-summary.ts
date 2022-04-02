import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
import { PublicRecordSummaryInfo } from './public-record-summary-info';

export class PublicRecordSummary extends Homogenize<Partial<PublicRecordSummary>> {
  Experian!: PublicRecordSummaryInfo;
  Equifax!: PublicRecordSummaryInfo;
  TransUnion!: PublicRecordSummaryInfo;
  Merge!: PublicRecordSummaryInfo;

  constructor(_data: Partial<PublicRecordSummary>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.Experian = new PublicRecordSummaryInfo(this.Experian);
    this.Equifax = new PublicRecordSummaryInfo(this.Equifax);
    this.TransUnion = new PublicRecordSummaryInfo(this.TransUnion);
    this.Merge = new PublicRecordSummaryInfo(this.Merge);
  }
}
