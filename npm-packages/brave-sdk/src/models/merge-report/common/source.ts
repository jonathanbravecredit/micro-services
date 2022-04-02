import { Homogenize } from '../../../utils/homogenize/homogenize-data';
import { CodeRef } from './code-ref';

export class Source extends Homogenize<Partial<Source>> {
  BorrowerKey: string | null = null;
  Bureau!: CodeRef;
  InquiryDate: string | null = null;
  Reference: string | null = null;

  constructor(_data: Partial<Source>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init() {
    this.Bureau = new CodeRef(this.Bureau);
  }
}
