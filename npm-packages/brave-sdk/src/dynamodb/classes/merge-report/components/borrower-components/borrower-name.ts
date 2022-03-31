import { ICodeRef, ISource } from '../../../../../_types/common-tu';
import { IBorrowerName, IName } from '../../../../../_types/merge-report';
import { Homogenize } from '../../../homogenize/homogenize-data';
import { CodeRef } from '../../common/code-ref';
import { Source } from '../../common/source';
import { Name } from './name';

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
    this.Name = new Name(this.Name);
    this.NameType = new CodeRef(this.NameType);
    this.Source = new Source(this.Source);
  }
}
