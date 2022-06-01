import { ISource } from 'libs/interfaces/common.interface';
import { IBorrowerBureauIdentifier } from 'libs/interfaces/mergereport.interface';
import { Homogenize } from 'libs/utils/mergereport/Base/HomogenizeData';
import { Source } from 'libs/utils/mergereport/Common/Source';

export class BorrowerBureauIdentifier
  extends Homogenize<Partial<IBorrowerBureauIdentifier>>
  implements IBorrowerBureauIdentifier
{
  type: string | null = null;
  identifier: string | null = null;
  partitionSet: number | string | null = null;
  Source!: ISource;

  constructor(_data: Partial<IBorrowerBureauIdentifier>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.Source = new Source(this.Source);
  }
}
