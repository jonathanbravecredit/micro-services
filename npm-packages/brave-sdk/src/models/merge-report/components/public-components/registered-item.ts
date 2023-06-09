import { ICodeRef } from '../../../../types';
import { IRegisteredItem } from '../../../../types/merge-report';
import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
import { CodeRef } from '../../common/code-ref';

export class RegisteredItem extends Homogenize<Partial<IRegisteredItem>> implements IRegisteredItem {
  Security: ICodeRef[] = [];
  originalBalance: number | string | null = null;
  dateMatures: string | null = null;

  constructor(_data: Partial<IRegisteredItem>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.Security = this.homogenizeArray<ICodeRef, CodeRef>(this.Security, CodeRef);
  }
}
