"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicRecordSummary = void 0;
const homogenize_data_1 = require("../../../../utils/homogenize/homogenize-data");
const public_record_summary_info_1 = require("./public-record-summary-info");
class PublicRecordSummary extends homogenize_data_1.Homogenize {
    constructor(_data) {
        super(_data);
        this.homogenize(_data);
        this.init();
    }
    init() {
        this.Experian = new public_record_summary_info_1.PublicRecordSummaryInfo(this.Experian);
        this.Equifax = new public_record_summary_info_1.PublicRecordSummaryInfo(this.Equifax);
        this.TransUnion = new public_record_summary_info_1.PublicRecordSummaryInfo(this.TransUnion);
        this.Merge = new public_record_summary_info_1.PublicRecordSummaryInfo(this.Merge);
    }
}
exports.PublicRecordSummary = PublicRecordSummary;
