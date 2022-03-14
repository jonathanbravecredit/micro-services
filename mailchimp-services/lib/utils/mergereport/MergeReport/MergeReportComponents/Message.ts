import { ICodeRef } from 'lib/interfaces/common.interface';
import { IMessage } from 'lib/interfaces/mergereport.interface';
import { Homogenize } from 'lib/utils/mergereport/Base/HomogenizeData';
import { CodeRef } from 'lib/utils/mergereport/Common/CodeRef';

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
