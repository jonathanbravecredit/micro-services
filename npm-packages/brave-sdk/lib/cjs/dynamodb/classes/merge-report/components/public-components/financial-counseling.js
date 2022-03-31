"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinancialCounseling = void 0;
const homogenize_data_1 = require("../../../homogenize/homogenize-data");
class FinancialCounseling extends homogenize_data_1.Homogenize {
    constructor(_data) {
        super(_data);
        this.amount = null;
        this.dateChecked = null;
        this.dateSettled = null;
        this.homogenize(_data);
    }
}
exports.FinancialCounseling = FinancialCounseling;
