import { ICodeRef, ISource, Name } from '../../../../types';
import { IBorrowerName, IName } from '../../../../types/merge-report';
import { Homogenize } from '../../../../utils';
import { CodeRef } from '../../common/code-ref';
import { Source } from '../../common/source';
import { TUName } from './tu-name';

export class BorrowerName extends Homogenize<Partial<IBorrowerName>> implements IBorrowerName {
  Name!: IName;
  NameType!: ICodeRef;
  Source!: ISource;
  partitionSet: number | string | null = null;
  dateReported: string | null = null;
  dateUpdated: string | null = null;

  constructor(_data: Partial<IBorrowerName>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.Name = new TUName(this.Name);
    this.NameType = new CodeRef(this.NameType);
    this.Source = new Source(this.Source);
  }
}
