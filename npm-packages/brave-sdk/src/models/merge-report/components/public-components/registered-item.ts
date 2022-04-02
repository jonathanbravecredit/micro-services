import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
import { CodeRef } from '../../common/code-ref';

export class RegisteredItem extends Homogenize<Partial<RegisteredItem>> {
  Security: CodeRef[] = [];
  originalBalance: number | string | null = null;
  dateMatures: string | null = null;

  constructor(_data: Partial<RegisteredItem>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.Security = this.homogenizeArray<CodeRef, CodeRef>(this.Security, CodeRef);
  }
}
