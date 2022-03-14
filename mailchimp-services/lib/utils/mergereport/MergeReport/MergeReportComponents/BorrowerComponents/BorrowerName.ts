import { ICodeRef, ISource } from 'lib/interfaces/common.interface';
import { IBorrowerName, IName } from 'lib/interfaces/mergereport.interface';
import { Homogenize } from 'lib/utils/mergereport/Base/HomogenizeData';
import { CodeRef } from 'lib/utils/mergereport/Common/CodeRef';
import { Source } from 'lib/utils/mergereport/Common/Source';
import { Name } from 'lib/utils/mergereport/MergeReport/MergeReportComponents/BorrowerComponents/Name';

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
