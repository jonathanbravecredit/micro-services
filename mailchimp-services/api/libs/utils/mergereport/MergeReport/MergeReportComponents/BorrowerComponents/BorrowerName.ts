import { ICodeRef, ISource } from 'libs/interfaces/common.interface';
import { IBorrowerName, IName } from '@bravecredit/brave-sdk/dist/types/merge-report';
import { Homogenize } from 'libs/utils/mergereport/Base/HomogenizeData';
import { CodeRef } from 'libs/utils/mergereport/Common/CodeRef';
import { Source } from 'libs/utils/mergereport/Common/Source';
import { Name } from 'libs/utils/mergereport/MergeReport/MergeReportComponents/BorrowerComponents/Name';

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
