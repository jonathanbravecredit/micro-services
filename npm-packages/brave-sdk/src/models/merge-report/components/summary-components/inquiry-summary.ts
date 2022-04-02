import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
import { InquirySummaryInfo } from './inquiry-summary-info';

export class InquirySummary extends Homogenize<Partial<InquirySummary>> {
  Experian!: InquirySummaryInfo;
  Equifax!: InquirySummaryInfo;
  TransUnion!: InquirySummaryInfo;
  Merge!: InquirySummaryInfo;

  constructor(_data: Partial<InquirySummary>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.Experian = new InquirySummaryInfo(this.Experian);
    this.Equifax = new InquirySummaryInfo(this.Equifax);
    this.TransUnion = new InquirySummaryInfo(this.TransUnion);
    this.Merge = new InquirySummaryInfo(this.Merge);
  }
}
