"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InquirySummaryInfo = void 0;
const homogenize_data_1 = require("../../../../utils/homogenize/homogenize-data");
class InquirySummaryInfo extends homogenize_data_1.Homogenize {
    constructor(_data) {
        super(_data);
        this.NumberInLast2Years = null;
        this.homogenize(_data);
    }
}
exports.InquirySummaryInfo = InquirySummaryInfo;
