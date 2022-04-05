"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BorrowerAddress = void 0;
const homogenize_data_1 = require("../../../../utils/homogenize/homogenize-data");
const code_ref_1 = require("../../common/code-ref");
const credit_address_1 = require("../../common/credit-address");
const source_1 = require("../../common/source");
class BorrowerAddress extends homogenize_data_1.Homogenize {
    constructor(_data) {
        super(_data);
        this.Source = new source_1.Source({});
        this.dateReported = null;
        this.addressOrder = null;
        this.partitionSet = null;
        this.homogenize(_data);
        this.init();
    }
    init() {
        this.CreditAddress = !this.CreditAddress ? new credit_address_1.CreditAddress({}) : new credit_address_1.CreditAddress(this.CreditAddress); // for now
        this.Dwelling = !this.Dwelling ? new code_ref_1.CodeRef({}) : new code_ref_1.CodeRef(this.Dwelling);
        this.Origin = !this.Origin ? new code_ref_1.CodeRef({}) : new code_ref_1.CodeRef(this.Origin);
        this.Ownership = !this.Ownership ? new code_ref_1.CodeRef({}) : new code_ref_1.CodeRef(this.Ownership);
        this.Source = !this.Source ? new source_1.Source({}) : new source_1.Source(this.Source);
    }
}
exports.BorrowerAddress = BorrowerAddress;
