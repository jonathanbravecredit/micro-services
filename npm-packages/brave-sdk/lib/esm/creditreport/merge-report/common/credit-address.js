import { Homogenize } from '../../../utils/homogenize/homogenize-data';
export class CreditAddress extends Homogenize {
    constructor(_data) {
        super(_data);
        this.city = null;
        this.country = null;
        this.county = null;
        this.direction = null;
        this.houseNumber = null;
        this.postDirection = null;
        this.stateCode = null;
        this.streetName = null;
        this.unit = null;
        this.unparsedStreet = null;
        this.postalCode = null;
        this.homogenize(_data);
    }
}
