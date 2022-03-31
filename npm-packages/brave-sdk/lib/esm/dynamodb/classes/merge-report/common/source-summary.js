import { Homogenize } from '../../homogenize/homogenize-data';
import { Source } from './source';
export class SourceSummary extends Homogenize {
    constructor(_data) {
        super(_data);
        this.homogenize(_data);
        this.init();
    }
    init() {
        this.Source = new Source(this.Source);
    }
}
