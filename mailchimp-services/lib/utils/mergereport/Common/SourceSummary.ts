import { ISource, ISourceSummary } from 'lib/interfaces/common.interface';
import { Homogenize } from 'lib/utils/mergereport/Base/HomogenizeData';
import { Source } from 'lib/utils/mergereport/Common/Source';

export class SourceSummary extends Homogenize<Partial<ISourceSummary>> implements ISourceSummary {
  Source!: ISource;

  constructor(_data: Partial<ISourceSummary>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init() {
    this.Source = new Source(this.Source);
  }
}
