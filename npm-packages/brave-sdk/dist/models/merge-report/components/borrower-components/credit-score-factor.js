"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreditScoreFactor = void 0;
const homogenize_data_1 = require("../../../../utils/homogenize/homogenize-data");
const code_ref_1 = require("../../common/code-ref");
class CreditScoreFactor extends homogenize_data_1.Homogenize {
    constructor(_data) {
        super(_data);
        this.FactorText = [];
        this.FactorType = null;
        this.bureauCode = null;
        this.homogenize(_data);
        this.init();
    }
    init() {
        this.Factor = new code_ref_1.CodeRef(this.Factor);
    }
}
exports.CreditScoreFactor = CreditScoreFactor;
