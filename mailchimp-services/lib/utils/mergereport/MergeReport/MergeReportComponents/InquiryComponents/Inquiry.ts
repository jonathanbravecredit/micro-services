import { ICodeRef, ISource } from 'lib/interfaces/common.interface';
import { IInquiry } from 'lib/interfaces/mergereport.interface';
import { Homogenize } from 'lib/utils/mergereport/Base/HomogenizeData';
import { CodeRef } from 'lib/utils/mergereport/Common/CodeRef';
import { Source } from 'lib/utils/mergereport/Common/Source';

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
