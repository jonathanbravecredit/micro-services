import { IInquiryPartition, IInquiry } from '../../../_types/merge-report';
import { Homogenize } from '../../../utils/homogenize/homogenize-data';
import { Inquiry } from './inquiry-components/inquiry';

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
