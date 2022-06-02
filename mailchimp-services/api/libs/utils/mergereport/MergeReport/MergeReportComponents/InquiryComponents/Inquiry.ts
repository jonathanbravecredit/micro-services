import { ICodeRef, ISource } from 'libs/interfaces/common.interface';
import { IInquiry } from '@bravecredit/brave-sdk/dist/types/merge-report';
import { Homogenize } from 'libs/utils/mergereport/Base/HomogenizeData';
import { CodeRef } from 'libs/utils/mergereport/Common/CodeRef';
import { Source } from 'libs/utils/mergereport/Common/Source';

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
