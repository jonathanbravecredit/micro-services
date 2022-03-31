"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreditAddress = void 0;
const homogenize_data_1 = require("../../homogenize/homogenize-data");
class CreditAddress extends homogenize_data_1.Homogenize {
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
exports.CreditAddress = CreditAddress;
