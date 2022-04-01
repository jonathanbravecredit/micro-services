"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InquirySummary = void 0;
const homogenize_data_1 = require("../../../../utils/homogenize/homogenize-data");
const inquiry_summary_info_1 = require("./inquiry-summary-info");
class InquirySummary extends homogenize_data_1.Homogenize {
    constructor(_data) {
        super(_data);
        this.homogenize(_data);
        this.init();
    }
    init() {
        this.Experian = new inquiry_summary_info_1.InquirySummaryInfo(this.Experian);
        this.Equifax = new inquiry_summary_info_1.InquirySummaryInfo(this.Equifax);
        this.TransUnion = new inquiry_summary_info_1.InquirySummaryInfo(this.TransUnion);
        this.Merge = new inquiry_summary_info_1.InquirySummaryInfo(this.Merge);
    }
}
exports.InquirySummary = InquirySummary;
