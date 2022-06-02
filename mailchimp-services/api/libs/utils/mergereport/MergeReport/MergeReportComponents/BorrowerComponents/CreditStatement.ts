import { ICodeRef, ISource } from 'libs/interfaces/common.interface';
import { ICreditStatement } from '@bravecredit/brave-sdk/dist/types/merge-report';
import { Homogenize } from 'libs/utils/mergereport/Base/HomogenizeData';
import { CodeRef } from 'libs/utils/mergereport/Common/CodeRef';
import { Source } from 'libs/utils/mergereport/Common/Source';

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
