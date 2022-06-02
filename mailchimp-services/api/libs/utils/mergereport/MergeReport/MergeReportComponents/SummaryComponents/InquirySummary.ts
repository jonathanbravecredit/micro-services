import { IInquirySummary, IInquirySummaryInfo } from '@bravecredit/brave-sdk/dist/types/merge-report';
import { Homogenize } from 'libs/utils/mergereport/Base/HomogenizeData';
import { InquirySummaryInfo } from 'libs/utils/mergereport/MergeReport/MergeReportComponents/SummaryComponents/InquirySummaryInfo';

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
