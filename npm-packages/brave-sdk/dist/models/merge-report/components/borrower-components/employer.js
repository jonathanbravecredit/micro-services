"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Employer = void 0;
const homogenize_data_1 = require("../../../../utils/homogenize/homogenize-data");
const credit_address_1 = require("../../common/credit-address");
const source_1 = require("../../common/source");
class Employer extends homogenize_data_1.Homogenize {
    constructor(_data) {
        super(_data);
        this.partitionSet = null;
        this.dateReported = null;
        this.dateUpdated = null;
        this.homogenize(_data);
    }
    init() {
        this.CreditAddress = new credit_address_1.CreditAddress(this.CreditAddress);
        this.Source = new source_1.Source(this.Source);
    }
}
exports.Employer = Employer;
