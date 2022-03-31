"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinancingStatement = void 0;
const homogenize_data_1 = require("../../../homogenize/homogenize-data");
const code_ref_1 = require("../../common/code-ref");
class FinancingStatement extends homogenize_data_1.Homogenize {
    constructor(_data) {
        super(_data);
        this.dateMaturity = null;
        this.homogenize(_data);
        this.init();
    }
    init() {
        this.CreditorType = new code_ref_1.CodeRef(this.CreditorType);
    }
}
exports.FinancingStatement = FinancingStatement;
