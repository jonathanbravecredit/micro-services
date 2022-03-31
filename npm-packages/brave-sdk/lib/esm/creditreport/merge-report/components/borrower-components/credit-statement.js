import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
import { CodeRef } from '../../common/code-ref';
import { Source } from '../../common/source';
export class CreditStatement extends Homogenize {
    constructor(_data) {
        super(_data);
        this.statement = null;
        this.homogenize(_data);
        this.init();
    }
    init() {
        this.StatementType = new CodeRef(this.StatementType);
        this.Source = new Source(this.Source);
    }
}
