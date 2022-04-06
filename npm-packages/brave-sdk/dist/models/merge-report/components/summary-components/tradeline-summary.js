"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TradelineSummary = void 0;
const homogenize_data_1 = require("../../../../utils/homogenize/homogenize-data");
const tradeline_summary_info_1 = require("./tradeline-summary-info");
class TradelineSummary extends homogenize_data_1.Homogenize {
    constructor(_data) {
        super(_data);
        this.homogenize(_data);
        this.init();
    }
    init() {
        this.Experian = new tradeline_summary_info_1.TradelineSummaryInfo(this.Experian);
        this.Equifax = new tradeline_summary_info_1.TradelineSummaryInfo(this.Equifax);
        this.TransUnion = new tradeline_summary_info_1.TradelineSummaryInfo(this.TransUnion);
        this.Merge = new tradeline_summary_info_1.TradelineSummaryInfo(this.Merge);
    }
}
exports.TradelineSummary = TradelineSummary;
