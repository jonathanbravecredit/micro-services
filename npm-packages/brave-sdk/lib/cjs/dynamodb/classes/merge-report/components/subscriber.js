"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subscriber = void 0;
const homogenize_data_1 = require("../../homogenize/homogenize-data");
const code_ref_1 = require("../common/code-ref");
const credit_address_1 = require("../common/credit-address");
const source_1 = require("../common/source");
class Subscriber extends homogenize_data_1.Homogenize {
    constructor(_data) {
        super(_data);
        this.subscriberCode = null;
        this.telephone = null;
        this.name = null;
        this.homogenize(_data);
        this.init();
    }
    init() {
        this.CreditAddress = new credit_address_1.CreditAddress(this.CreditAddress);
        this.IndustryCode = new code_ref_1.CodeRef(this.IndustryCode);
        this.Source = new source_1.Source(this.Source);
    }
}
exports.Subscriber = Subscriber;
