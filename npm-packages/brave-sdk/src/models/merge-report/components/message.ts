import { Homogenize } from '../../../utils/homogenize/homogenize-data';
import { CodeRef } from '../common/code-ref';

export class Message extends Homogenize<Partial<Message>> implements Message {
  Code!: CodeRef;
  Type!: CodeRef;

  constructor(_data: Partial<Message>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.Code = new CodeRef(this.Code);
    this.Type = new CodeRef(this.Type);
  }
}
