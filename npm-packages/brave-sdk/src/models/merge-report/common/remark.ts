import { IRemark, ICodeRef } from '../../../types';
import { Homogenize } from '../../../utils/homogenize/homogenize-data';
import { CodeRef } from './code-ref';

export class Remark extends Homogenize<Partial<IRemark>> implements IRemark {
  RemarkCode!: ICodeRef;
  customRemark: string | null = null;

  constructor(_data: Partial<IRemark>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.RemarkCode = new CodeRef(this.RemarkCode);
  }
}
