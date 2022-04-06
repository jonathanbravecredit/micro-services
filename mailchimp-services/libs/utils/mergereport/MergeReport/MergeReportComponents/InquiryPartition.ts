import { IInquiry, IInquiryPartition, IInquirySummaryInfo } from 'libs/interfaces/mergereport.interface';
import { Homogenize } from 'libs/utils/mergereport/Base/HomogenizeData';
import { Inquiry } from 'libs/utils/mergereport/MergeReport/MergeReportComponents/InquiryComponents/Inquiry';

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
