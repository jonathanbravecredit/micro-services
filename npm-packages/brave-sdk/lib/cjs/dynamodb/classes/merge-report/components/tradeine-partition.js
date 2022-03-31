"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TradeLinePartition = void 0;
const homogenize_data_1 = require("../../homogenize/homogenize-data");
const tradeline_1 = require("./tradeline-components/tradeline");
class TradeLinePartition extends homogenize_data_1.Homogenize {
    constructor(_data) {
        super(_data);
        this.accountTypeDescription = null;
        this.accountTypeSymbol = null;
        this.accountTypeAbbreviation = null;
        this.homogenize(_data);
        this.init();
    }
    init() {
        this.Tradeline = new tradeline_1.Tradeline(this.Tradeline);
    }
}
exports.TradeLinePartition = TradeLinePartition;
