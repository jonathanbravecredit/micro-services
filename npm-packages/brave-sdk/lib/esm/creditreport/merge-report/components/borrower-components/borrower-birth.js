import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
import { Source } from '../../common/source';
import { TUDate } from '../../common/tu-date';
export class BorrowerBirth extends Homogenize {
    constructor(_data) {
        super(_data);
        this.date = null;
        this.age = null;
        this.partitionSet = null;
        this.homogenize(_data);
        this.init();
    }
    init() {
        this.BirthDate = new TUDate(this.BirthDate);
        this.Source = new Source(this.Source);
    }
}
