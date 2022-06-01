import { ICodeRef, ISource } from 'libs/interfaces/common.interface';
import { Homogenize } from 'libs/utils/mergereport/Base/HomogenizeData';
import { CodeRef } from 'libs/utils/mergereport/Common/CodeRef';

export class Source extends Homogenize<Partial<ISource>> implements ISource {
  BorrowerKey: string | null = null;
  Bureau!: ICodeRef;
  InquiryDate: string | null = null;
  Reference: string | null = null;

  constructor(_data: Partial<ISource>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init() {
    this.Bureau = new CodeRef(this.Bureau);
  }
}
