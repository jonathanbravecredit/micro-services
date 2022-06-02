import { ICodeRef } from 'libs/interfaces/common.interface';
import { IMessage } from '@bravecredit/brave-sdk/dist/types/merge-report';
import { Homogenize } from 'libs/utils/mergereport/Base/HomogenizeData';
import { CodeRef } from 'libs/utils/mergereport/Common/CodeRef';

export class Message extends Homogenize<Partial<IMessage>> implements IMessage {
  Code!: ICodeRef;
  Type!: ICodeRef;

  constructor(_data: Partial<IMessage>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.Code = new CodeRef(this.Code);
    this.Type = new CodeRef(this.Type);
  }
}
