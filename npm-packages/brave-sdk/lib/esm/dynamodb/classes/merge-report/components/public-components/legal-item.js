import { Homogenize } from '../../../homogenize/homogenize-data';
import { CodeRef } from '../../common/code-ref';
export class LegalItem extends Homogenize {
    constructor(_data) {
        super(_data);
        this.plaintiff = null;
        this.lawyer = null;
        this.thirdParty = null;
        this.actionAmount = null;
        this.balance = null;
        this.dateSatisfied = null;
        this.homogenize(_data);
        this.init();
    }
    init() {
        this.CourtLocation = new CodeRef(this.CourtLocation);
        this.CourtType = new CodeRef(this.CourtType);
    }
}
