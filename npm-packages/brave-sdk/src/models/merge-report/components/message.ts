import { ICodeRef } from '../../../types';
import { IMessage } from '../../../types/merge-report';
import { Homogenize } from '../../../utils/homogenize/homogenize-data';
import { CodeRef } from '../common/code-ref';

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
