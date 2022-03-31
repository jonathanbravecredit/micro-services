import { ICodeRef, ISource } from '../../../../../_types/common-tu';
import { IInquiry } from '../../../../../_types/merge-report';
import { Homogenize } from '../../../homogenize/homogenize-data';
import { CodeRef } from '../../common/code-ref';
import { Source } from '../../common/source';

export class Inquiry extends Homogenize<Partial<IInquiry>> implements IInquiry {
  IndustryCode!: ICodeRef;
  Source!: ISource;
  bureau: string | null = null;
  inquiryType: string | null = null;
  subscriberNumber: string | null = null;
  inquiryDate: string | null = null;
  subscriberName: string | null = null;

  constructor(_data: Partial<IInquiry>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.IndustryCode = new CodeRef(this.IndustryCode);
    this.Source = new Source(this.Source);
  }
}
