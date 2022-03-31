"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LegalItem = void 0;
const homogenize_data_1 = require("../../../homogenize/homogenize-data");
const code_ref_1 = require("../../common/code-ref");
class LegalItem extends homogenize_data_1.Homogenize {
    constructor(_data) {
        super(_data);
        this.plaintiff = null;
        this.lawyer = null;
        this.thirdParty = null;
        this.actionAmount = null;
        this.balance = null;
        this.dateSatisfied = null;
        this.homogenize(_data);
        this.init();
    }
    init() {
        this.CourtLocation = new code_ref_1.CodeRef(this.CourtLocation);
        this.CourtType = new code_ref_1.CodeRef(this.CourtType);
    }
}
exports.LegalItem = LegalItem;
