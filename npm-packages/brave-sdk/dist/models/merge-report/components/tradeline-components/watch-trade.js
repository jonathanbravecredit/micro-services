"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WatchTrade = void 0;
const homogenize_data_1 = require("../../../../utils/homogenize/homogenize-data");
const code_ref_1 = require("../../common/code-ref");
class WatchTrade extends homogenize_data_1.Homogenize {
    constructor(_data) {
        super(_data);
        this.previousAmountPastDue = null;
        this.amountPastDue = null;
        this.homogenize(_data);
        this.init();
    }
    init() {
        this.ContactMethod = new code_ref_1.CodeRef(this.ContactMethod);
        this.CreditType = new code_ref_1.CodeRef(this.CreditType);
        this.PreviousAccountCondition = new code_ref_1.CodeRef(this.PreviousAccountCondition);
    }
}
exports.WatchTrade = WatchTrade;
