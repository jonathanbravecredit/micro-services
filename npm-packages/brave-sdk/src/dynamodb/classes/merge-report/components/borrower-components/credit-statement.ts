import { ICodeRef, ISource } from '../../../../../_types/common-tu';
import { ICreditStatement } from '../../../../../_types/merge-report';
import { Homogenize } from '../../../homogenize/homogenize-data';
import { CodeRef } from '../../common/code-ref';
import { Source } from '../../common/source';

export class CreditStatement extends Homogenize<Partial<ICreditStatement>> implements ICreditStatement {
  StatementType!: ICodeRef;
  Source!: ISource;
  statement: string | null = null;

  constructor(_data: Partial<ICreditStatement>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.StatementType = new CodeRef(this.StatementType);
    this.Source = new Source(this.Source);
  }
}
