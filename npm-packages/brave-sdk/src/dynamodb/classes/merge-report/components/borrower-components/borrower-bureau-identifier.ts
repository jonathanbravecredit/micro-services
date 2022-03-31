import { ISource } from '../../../../../_types/common-tu';
import { IBorrowerBureauIdentifier } from '../../../../../_types/merge-report';
import { Homogenize } from '../../../homogenize/homogenize-data';
import { Source } from '../../common/source';

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
