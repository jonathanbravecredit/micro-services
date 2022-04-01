import { Homogenize } from '../../../../utils/homogenize/homogenize-data';
export class MiscPublicRecord extends Homogenize {
    constructor(_data) {
        super(_data);
        this.miscInformation = null;
        this.homogenize(_data);
    }
}
