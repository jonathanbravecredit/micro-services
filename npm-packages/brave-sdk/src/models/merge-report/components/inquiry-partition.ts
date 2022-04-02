import { Homogenize } from '../../../utils/homogenize/homogenize-data';
import { Inquiry } from './inquiry-components/inquiry';

export class InquiryPartition extends Homogenize<Partial<InquiryPartition>> {
  Inquiry!: Inquiry;

  constructor(_data: Partial<InquiryPartition>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.Inquiry = new Inquiry(this.Inquiry);
  }
}
