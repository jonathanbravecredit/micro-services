import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
export class Bankruptcy extends Homogenize {
    constructor(_data) {
        super(_data);
        this.courtNumber = null;
        this.division = null;
        this.assetAmount = null;
        this.dateResolved = null;
        this.exemptAmount = null;
        this.liabilityAmount = null;
        this.trustee = null;
        this.company = null;
        this.thirdParty = null;
        this.homogenize(_data);
    }
}
