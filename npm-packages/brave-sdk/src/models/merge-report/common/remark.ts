import { Homogenize } from '../../../utils/homogenize/homogenize-data';
import { CodeRef } from './code-ref';

export class Remark extends Homogenize<Partial<Remark>> {
  RemarkCode!: CodeRef;
  customRemark: string | null = null;

  constructor(_data: Partial<Remark>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.RemarkCode = new CodeRef(this.RemarkCode);
  }
}
