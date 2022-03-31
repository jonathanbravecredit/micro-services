import { ISource, ICodeRef } from '../../../../_types/common-tu';
import { Homogenize } from '../../homogenize/homogenize-data';
import { CodeRef } from './code-ref';

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
