import { IInquiry, IInquiryPartition, IInquirySummaryInfo } from 'lib/interfaces/mergereport.interface';
import { Homogenize } from 'lib/utils/mergereport/Base/HomogenizeData';
import { Inquiry } from 'lib/utils/mergereport/MergeReport/MergeReportComponents/InquiryComponents/Inquiry';

export class InquiryPartition extends Homogenize<Partial<IInquiryPartition>> implements IInquiryPartition {
  Inquiry!: IInquiry;

  constructor(_data: Partial<IInquiryPartition>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.Inquiry = new Inquiry(this.Inquiry);
  }
}
