"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InquiryPartition = void 0;
const homogenize_data_1 = require("../../../utils/homogenize/homogenize-data");
const inquiry_1 = require("./inquiry-components/inquiry");
class InquiryPartition extends homogenize_data_1.Homogenize {
    constructor(_data) {
        super(_data);
        this.homogenize(_data);
        this.init();
    }
    init() {
        this.Inquiry = new inquiry_1.Inquiry(this.Inquiry);
    }
}
exports.InquiryPartition = InquiryPartition;
