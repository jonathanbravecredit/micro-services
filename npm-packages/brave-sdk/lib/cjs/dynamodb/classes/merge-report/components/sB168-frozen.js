"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SB168Frozen = void 0;
const homogenize_data_1 = require("../../homogenize/homogenize-data");
class SB168Frozen extends homogenize_data_1.Homogenize {
    constructor(_data) {
        super(_data);
        this.equifax = null;
        this.experian = null;
        this.transunion = null;
        this.homogenize(_data);
    }
}
exports.SB168Frozen = SB168Frozen;
