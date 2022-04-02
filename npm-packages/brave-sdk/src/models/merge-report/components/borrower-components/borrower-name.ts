import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
import { CodeRef } from '../../common/code-ref';
import { Source } from '../../common/source';
import { TUName } from './tu-name';

export class BorrowerName extends Homogenize<Partial<BorrowerName>> {
  Name!: TUName;
  NameType!: CodeRef;
  Source!: Source;
  partitionSet: number | string | null = null;
  dateReported: string | null = null;
  dateUpdated: string | null = null;

  constructor(_data: Partial<BorrowerName>) {
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
