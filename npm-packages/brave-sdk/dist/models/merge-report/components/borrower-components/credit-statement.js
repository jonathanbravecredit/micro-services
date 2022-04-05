"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreditStatement = void 0;
const homogenize_data_1 = require("../../../../utils/homogenize/homogenize-data");
const code_ref_1 = require("../../common/code-ref");
const source_1 = require("../../common/source");
class CreditStatement extends homogenize_data_1.Homogenize {
    constructor(_data) {
        super(_data);
        this.statement = null;
        this.homogenize(_data);
        this.init();
    }
    init() {
        this.StatementType = new code_ref_1.CodeRef(this.StatementType);
        this.Source = new source_1.Source(this.Source);
    }
}
exports.CreditStatement = CreditStatement;
