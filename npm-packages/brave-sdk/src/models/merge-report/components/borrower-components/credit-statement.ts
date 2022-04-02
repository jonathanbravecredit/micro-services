import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
import { CodeRef } from '../../common/code-ref';
import { Source } from '../../common/source';

export class CreditStatement extends Homogenize<Partial<CreditStatement>> {
  StatementType!: CodeRef;
  Source!: Source;
  statement: string | null = null;

  constructor(_data: Partial<CreditStatement>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.StatementType = new CodeRef(this.StatementType);
    this.Source = new Source(this.Source);
  }
}
