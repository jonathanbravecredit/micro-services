import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
import { CodeRef } from '../../common/code-ref';
import { Source } from '../../common/source';
import { Name } from './name';
export class BorrowerName extends Homogenize {
    constructor(_data) {
        super(_data);
        this.partitionSet = null;
        this.dateReported = null;
        this.dateUpdated = null;
        this.homogenize(_data);
        this.init();
    }
    init() {
        this.Name = new Name(this.Name);
        this.NameType = new CodeRef(this.NameType);
        this.Source = new Source(this.Source);
    }
}
