"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Inquiry = void 0;
const homogenize_data_1 = require("../../../homogenize/homogenize-data");
const code_ref_1 = require("../../common/code-ref");
const source_1 = require("../../common/source");
class Inquiry extends homogenize_data_1.Homogenize {
    constructor(_data) {
        super(_data);
        this.bureau = null;
        this.inquiryType = null;
        this.subscriberNumber = null;
        this.inquiryDate = null;
        this.subscriberName = null;
        this.homogenize(_data);
        this.init();
    }
    init() {
        this.IndustryCode = new code_ref_1.CodeRef(this.IndustryCode);
        this.Source = new source_1.Source(this.Source);
    }
}
exports.Inquiry = Inquiry;
