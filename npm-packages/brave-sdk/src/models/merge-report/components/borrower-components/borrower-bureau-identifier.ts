import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
import { Source } from '../../common/source';

export class BorrowerBureauIdentifier extends Homogenize<Partial<BorrowerBureauIdentifier>> {
  type: string | null = null;
  identifier: string | null = null;
  partitionSet: number | string | null = null;
  Source!: Source;

  constructor(_data: Partial<BorrowerBureauIdentifier>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.Source = new Source(this.Source);
  }
}
