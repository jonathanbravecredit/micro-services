import { ISource, ISourceSummary } from 'libs/interfaces/common.interface';
import { Homogenize } from 'libs/utils/mergereport/Base/HomogenizeData';
import { Source } from 'libs/utils/mergereport/Common/Source';

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
