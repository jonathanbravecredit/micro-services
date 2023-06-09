import { ISource, ISourceSummary } from '../../../types';
import { Homogenize } from '../../../utils/homogenize/homogenize-data';
import { Source } from './source';

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
