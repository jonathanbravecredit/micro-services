import { Homogenize } from '../../../utils/homogenize/homogenize-data';
import { Source } from './source';

export class SourceSummary extends Homogenize<Partial<SourceSummary>> {
  Source!: Source;

  constructor(_data: Partial<SourceSummary>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init() {
    this.Source = new Source(this.Source);
  }
}
