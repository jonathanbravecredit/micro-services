"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BorrowerTelephone = void 0;
const homogenize_data_1 = require("../../../../utils/homogenize/homogenize-data");
const code_ref_1 = require("../../common/code-ref");
const source_1 = require("../../common/source");
const phone_number_1 = require("./phone-number");
class BorrowerTelephone extends homogenize_data_1.Homogenize {
    constructor(_data) {
        super(_data);
        this.partitionSet = null;
        this.dateReported = null;
        this.dateUpdated = null;
        this.homogenize(_data);
        this.init();
    }
    init() {
        this.PhoneNumber = new phone_number_1.PhoneNumber(this.PhoneNumber);
        this.PhoneType = new code_ref_1.CodeRef(this.PhoneType);
        this.Source = new source_1.Source(this.Source);
    }
}
exports.BorrowerTelephone = BorrowerTelephone;
