"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicRecordSummaryInfo = void 0;
const homogenize_data_1 = require("../../../../utils/homogenize/homogenize-data");
class PublicRecordSummaryInfo extends homogenize_data_1.Homogenize {
    constructor(_data) {
        super(_data);
        this.NumberOfRecords = null;
        this.homogenize(_data);
    }
}
exports.PublicRecordSummaryInfo = PublicRecordSummaryInfo;
