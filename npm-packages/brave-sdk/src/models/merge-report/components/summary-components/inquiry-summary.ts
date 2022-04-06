import { IInquirySummary, IInquirySummaryInfo } from '../../../../types/merge-report';
import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
import { InquirySummaryInfo } from './inquiry-summary-info';

export class InquirySummary extends Homogenize<Partial<IInquirySummary>> implements IInquirySummary {
  Experian!: IInquirySummaryInfo;
  Equifax!: IInquirySummaryInfo;
  TransUnion!: IInquirySummaryInfo;
  Merge!: IInquirySummaryInfo;

  constructor(_data: Partial<IInquirySummary>) {
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
