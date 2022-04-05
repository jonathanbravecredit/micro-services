"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MergeReport = void 0;
const homogenize_data_1 = require("../../utils/homogenize/homogenize-data");
const truelink_credit_report_1 = require("./components/truelink-credit-report");
/**
 * Rules for merge report.
 * 1. primitives can terminate in a value or null
 * 2. no leaves can be undefined and must conform to class properties that define it
 * 3. arrays can ONLY terminate in an empty array
 * 4. complex objects CANNOT terminate in a null. Must go to leaves
 */
class MergeReport extends homogenize_data_1.Homogenize {
    constructor(_data) {
        super(_data);
        this.homogenize(_data);
        this.init();
    }
    init() {
        this.TrueLinkCreditReportType = new truelink_credit_report_1.TrueLinkCreditReportType(this.TrueLinkCreditReportType);
    }
}
exports.MergeReport = MergeReport;
