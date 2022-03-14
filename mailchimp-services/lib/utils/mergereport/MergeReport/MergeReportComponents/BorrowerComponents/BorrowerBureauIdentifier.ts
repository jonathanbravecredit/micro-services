import { ISource } from 'lib/interfaces/common.interface';
import { IBorrowerBureauIdentifier } from 'lib/interfaces/mergereport.interface';
import { Homogenize } from 'lib/utils/mergereport/Base/HomogenizeData';
import { Source } from 'lib/utils/mergereport/Common/Source';

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
