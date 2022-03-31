import { Homogenize } from '../../../homogenize/homogenize-data';
import { Source } from '../../common/source';
export class BorrowerBureauIdentifier extends Homogenize {
    constructor(_data) {
        super(_data);
        this.type = null;
        this.identifier = null;
        this.partitionSet = null;
        this.homogenize(_data);
        this.init();
    }
    init() {
        this.Source = new Source(this.Source);
    }
}
