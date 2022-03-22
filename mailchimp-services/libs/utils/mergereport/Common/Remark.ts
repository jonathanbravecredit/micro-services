import { ICodeRef, IRemark } from 'libs/interfaces/common.interface';
import { Homogenize } from 'libs/utils/mergereport/Base/HomogenizeData';
import { CodeRef } from 'libs/utils/mergereport/Common/CodeRef';

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
